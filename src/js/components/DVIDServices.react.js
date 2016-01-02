"use strict";

var React = require('react');

var JsonForm = require('./JsonForm.react');
var JobStatus = require('./JobStatus.react');
var Help = require('./Help.react');
window.$ = window.jQuery = require('jquery');

var serviceListURI = "/services";
var serviceURI = "/service";

/*
 * Master component that allows a user to select a
 * DVID service, retrieve a configuration form, and
 * launch a DVID service using this configuration.
 * Currently this components contains the json-editor
 * component and the dropdown component that interacts
 * with the service server.
*/
var DVIDServices = React.createClass({
    getInitialState: function () {
        return {
            schema: null,
            currentService: null,
            schemaResults: null,
            submitted: false,
            jobCallback: null,
            jobLaunchError: false,
            jobErrorMessage: "",
            services: []
        };

    },
    // load services from service server
    loadServices: function (data) {
        this.setState({services: data});
    },
    // load schema for a given service
    loadSchema: function (data) {
        // props passed to children when re-render occurs
        this.setState({schema: data});
    },
    componentWillMount: function () {
        $.getJSON(this.props.service + serviceListURI, this.loadServices);
    },
    changeSchema: function (ev) {
        if (ev.target.value !== "Choose Service") {
            $.getJSON(this.props.service + serviceURI + "/" + ev.target.value, this.loadSchema);
            this.setState({schemaResults: null, currentService: ev.target.value});
        } else {
            this.setState({schemaResults: null, schema: null, currentService: ev.target.value});
        }
    },
    handleResubmit: function () {
        this.setState({submitted: false, jobLaunchError: false, jobCallback: null});
    },
    handleManSubmit: function () {
        var value = $("#manualjsontext").val(); 
        
        // send the request
        this.setState({submitted: true, jobLaunchError: false, schemaResults: JSON.parse(value)});

        $.ajax({
            type: "POST",
            url: this.props.service + serviceURI + "/" + this.state.currentService,
            data: value,
            success: function (dataret) {
                if (dataret) {
                    this.setState({jobCallback: dataret.callBack});
                } 
            }.bind(this),
            error: function (dataret) {
                this.setState({jobLaunchError: true, jobErrorMessage: dataret.responseText});
            }.bind(this),
            dataType: "json"
        });
        
    },
    postJSON: function (data, message) {
        if (message != null) {
            // if there is an error message save the current form state but put an error
            this.setState({jobLaunchError: true, jobErrorMessage: message, schemaResults: data});
            return;
        }
        
        // send the request
        this.setState({submitted: true, jobLaunchError: false, schemaResults: data});

        $.ajax({
            type: "POST",
            url: this.props.service + serviceURI + "/" + this.state.currentService,
            data: JSON.stringify(data),
            success: function (dataret) {
                if (dataret) {
                    this.setState({jobCallback: dataret.callBack});
                } 
            }.bind(this),
            error: function (dataret) {
                this.setState({jobLaunchError: true, jobErrorMessage: dataret.responseText});
            }.bind(this),
            dataType: "json"
        });
        
    },
    render: function () {
        var formholder, manholder, tabentry, formholder2, formcolumn, errorholder, main_tab;

        // add tabs for (job submission/status, help)

        // help tab
        var help_tab = (
                <div className="container-fluid">
                    <Help address={this.props.service} />;
                </div>
            );

        // main tab
        
        // TODO: convert this to the default route
        // load services submission selection and forms widgets
        if (!this.state.submitted) {
            // initialize to no json-editor
            if (this.state.schema === null) {
                formholder = <div />;
                manholder = <div />;
                tabentry = <div />;
            } else {
                formholder = <div><JsonForm ref="editor" initialData={this.state.schemaResults} schema={this.state.schema} postCallback={this.postJSON} /></div>;
                
                // allow manually entering JSON 
                manholder = (
                        <div>
                        <label>Enter JSON</label><br />
                        <form>
                        <button type="button" className="btn btn-default" onClick={this.handleManSubmit}>Submit</button>
                        <textarea className="form-control" id="manualjsontext" rows="15"></textarea>
                        </form>
                        </div>
                );
            
                tabentry = (
                    <div>
                        <ul className="nav nav-tabs" role="tablist">
                            <li role="presentation" className="active">
                                <a href="#jsoneform" aria-controls="jsoneform" role="tab" data-toggle="tab">JSON Form</a>
                            </li>
                            <li role="presentation">
                                <a href="#manform" aria-controls="manform" role="tab" data-toggle="tab">Manual JSON</a>
                            </li>
                        </ul>
                        
                        <div className="tab-content">
                            <div role="tabpanel" className="tab-pane active" id="jsoneform">
                                {formholder}
                            </div>
                            <div role="tabpanel" className="tab-pane" id="manform">
                                {manholder}
                            </div>
                        </div>
                    </div>
                );
            
            }

            if (this.state.jobLaunchError) {
                errorholder = (
                        <div className="alert alert-danger" role="alert">
                        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                        <span className="sr-only">Error:</span>
                        Failed submission: {this.state.jobErrorMessage}
                        </div>
                        );
            } else {
                errorholder = <div />;
            }

            formcolumn = (
                    <div>
                    <select className="form-control" onChange={this.changeSchema}>
                    <option value="Choose Service">Choose Service</option>;
                    {this.state.services.map(function (val) {
                        return <option key={val} value={val}>{val}</option>;
                    })}   
                    </select>
                    
                    {tabentry}
                    
                    {errorholder}
                    </div>
                   );
        } else { // load resulting widget
            formcolumn = (
                    <div>
                    <label>Submitted JSON</label><br />
                    <button type="button" className="btn btn-default" onClick={this.handleResubmit}>Relaunch Service</button>
                    <pre>{JSON.stringify(this.state.schemaResults, null, 4)}</pre>
                    </div>
            );
        }

        if (!this.state.submitted) {
            main_tab = (
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">{formcolumn}</div>
                        </div>
                    </div>
                   );
        } else {
            var statusComponent;

            if (this.state.jobLaunchError) {
                statusComponent = (
                        <div className="alert alert-danger" role="alert">
                        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                        <span className="sr-only">Error:</span>
                        Failed submission: {this.state.jobErrorMessage}
                        </div>
                        );
            } else if (this.state.jobCallback != null) {
                statusComponent = (
                        <JobStatus jobCallback={this.state.jobCallback} />
                    );
            } else {
                statusComponent = (
                        <div style={{margin: "10px"}}>
                        <button className="btn btn-lg btn-warning">
                        <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Launching Job...    
                        </button> 
                        </div>
                    );
            }

            main_tab =  (
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">{formcolumn}</div>
                            <div className="col-md-6">{statusComponent}</div>
                        </div>
                    </div>
                );

        }


        //<a href="#" className="pull-left"><img src="https://raw.github.com/janelia-flyem/janelia-flyem.github.com/master/images/HHMI_Janelia_Color_Alternate_180x40.png" /></a>

        return (
                <div className="container">
                    <div className="page-header">
                    <h1>DVID Services Console <small>Submitting and Monitoring Spark DVID Jobs</small></h1>
                    </div>
                    <ul className="nav nav-tabs" role="tablist">
                        <li role="presentation" className="active">
                            <a href="#home" aria-controls="home" role="tab" data-toggle="tab">Home</a>
                        </li>
                        <li role="presentation">
                            <a href="#help" aria-controls="help" role="tab" data-toggle="tab">Help</a>
                        </li>
                    </ul>
                    
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-pane active" id="home">
                            {main_tab}
                        </div>
                        <div role="tabpanel" className="tab-pane" id="help">
                            {help_tab}
                        </div>
                    </div>
                </div>
        );

        // add tabs
    }
});


module.exports = DVIDServices;
