"use strict";

var React = require('react');

var JsonForm = require('./JsonForm.react');

var serviceListURI = "/services";

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
            $.getJSON(this.props.service + "/" + ev.target.value, this.loadSchema);
            this.setState({schemaResults: null, currentService: ev.target.value});
        } else {
            this.setState({schemaResults: null, schema: null, currentService: ev.target.value});
        }
    },
    handleResubmit: function () {
        this.setState({submitted: false});
    },
    postJSON: function (data) {
        // send the request
        this.setState({submitted: true, schemaResults: data});
        //alert("Submitted: " + JSON.stringify(data));
        $.post(this.props.service + "/" + this.state.currentService, JSON.stringify(data), function () {
            // DO NOTHING
            return;
        }, 'json');
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
                    <div style={{margin: "10px", width: "50%"}}>
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
                    <div style={{margin: "10px", width: "50%"}}>
                    <label>Submitted JSON</label><br />
                    <button type="button" className="btn btn-default" onClick={this.handleResubmit}>Relaunch Service</button>
                    <pre>{JSON.stringify(this.state.schemaResults, null, 4)}</pre>
                    </div>
            );
        }

        return (
            <tr>
            <td>{formcolumn}</td>
            <td></td>
            </tr>
        );
    }
});


module.exports = DVIDServices;
