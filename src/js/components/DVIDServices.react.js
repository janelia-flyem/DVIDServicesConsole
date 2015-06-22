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
            services: [],
            servicesonline: true,
            divId: 1 // hack to erase old json-editor div
        };

    },
    // load services from service server
    loadServices: function (data) {
        this.setState({services: data});
    },
    // load schema for a given service
    loadSchema: function (data) {
        this.setState({schema: data, divId: this.state.divId + 1});
    },
    componentWillMount: function () {
        $.getJSON(this.props.service + "/services", this.loadServices);
    },
    changeSchema: function (ev) {
        if (ev.target.value !== "Choose One") {
            $.getJSON(this.props.service + "/" + ev.target.value, this.loadSchema);
        } else {
            this.setState({schema: null});
        }
    },
    render: function () {
        var formholder, formholder2;

        // bad hack to 0 out form, cannot emit information
        // for JsonForm to update very easily
        if (this.state.schema === null) {
            formholder = <div />;
            formholder2 = <div />;
        } else {
            formholder2 = <div />; 
            formholder = <div><JsonForm schema={this.state.schema} /></div>;
            if (this.state.divId % 2 === 0) {
                var temp = formholder2;
                formholder2 = formholder;
                formholder = temp;
            }
        }

        return (
            <div style={{margin: "10px", width: "50%"}}>
                <select onChange={this.changeSchema}>
                    <option value="Choose One">Choose One</option>;
                    {this.state.services.map(function (val) {
                        return <option key={val} value={val}>{val}</option>;
                    })}   
                </select>
                {formholder}
                {formholder2}
            </div>
        );
    }
});


module.exports = DVIDServices;
