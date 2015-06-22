"use strict";

var React = require('react');

var JsonForm = require('./JsonForm.react');

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
        $.getJSON(this.props.service + "/services", this.loadServices);
    },
    changeSchema: function (ev) {
        if (ev.target.value !== "Choose Service") {
            $.getJSON(this.props.service + "/" + ev.target.value, this.loadSchema);
            this.setState({currentService: ev.target.value});
        } else {
            this.setState({schema: null, currentService: ev.target.value});
        }
    },
    postJSON: function (data) {
        // Send the request
        alert("Submitted: " + JSON.stringify(data));
        $.post(this.props.service + "/" + this.state.currentService, JSON.stringify(data), function () {
            // DO NOTHING
            return;
        }, 'json');
    },
    render: function () {
        var formholder, formholder2;

        // initialize to no json-editor
        if (this.state.schema === null) {
            formholder = <div />;
        } else {
            formholder = <div><JsonForm ref="editor" schema={this.state.schema} postCallback={this.postJSON} /></div>;
        }

        return (
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
    }
});


module.exports = DVIDServices;
