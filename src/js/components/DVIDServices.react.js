"use strict";

var React = require('react');

var JsonForm = require('./JsonForm.react');
var JobStatus = require('./JobStatus.react');

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
    postJSON: function (data) {
        // send the request
        this.setState({submitted: true, schemaResults: data});

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
                this.setState({jobLaunchError: true, jobErrorMessage: dataret});
            }.bind(this),
            dataType: "json"
        });
        
    },
    render: function () {
        var formholder, formholder2, formcolumn;

        // TODO: convert this to the default route
        // load services submission selection and forms widgets
        if (!this.state.submitted) {
            // initialize to no json-editor
            if (this.state.schema === null) {
                formholder = <div />;
            } else {
                formholder = <div><JsonForm ref="editor" initialData={this.state.schemaResults} schema={this.state.schema} postCallback={this.postJSON} /></div>;
            }

            formcolumn = (
                    <div>
                    <select className="form-control" onChange={this.changeSchema}>
                    <option value="Choose Service">Choose Service</option>;
                    {this.state.services.map(function (val) {
                                                                return <option key={val} value={val}>{val}</option>;
                                                            })}   
                    </select>
                    {formholder}
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
            return (
                    <div className="container-fluid">
                        <h1>DVID Services Console</h1>
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

            return (
                    <div className="container-fluid">
                        <h1>DVID Services Console</h1>
                        <div className="row">
                            <div className="col-md-6">{formcolumn}</div>
                            <div className="col-md-6">{statusComponent}</div>
                        </div>
                    </div>
                );

        }
    }
});


module.exports = DVIDServices;
