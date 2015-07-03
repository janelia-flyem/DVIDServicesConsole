"use strict";

var React = require('react');
var dvid = require('dvid');

window.$ = window.jQuery = require('jquery');

/*global JSONEditor */
require('json-editor');


// Recursively examine object for dvid servers
function grabPathsToDVIDNames(schema, curr_name_path, dvidname_paths) {
    for (var prop in schema) {
        if (prop === "property" && schema[prop] == "dvid-server") {
            dvidname_paths.push(curr_name_path.slice());
        } else if (schema.hasOwnProperty(prop)) {
            // ignore names not in final path
            if (prop !== "properties") {
                curr_name_path.push(prop);
            }
            if (schema[prop] !== null && typeof schema[prop] === 'object') {
                grabPathsToDVIDNames(schema[prop], curr_name_path, dvidname_paths);
            }
            if (prop !== "properties") {
                curr_name_path.pop();
            }
        }
    }
}

/*
 * Wraps json-editor code which takes a schema and produces
 * an HTML web form.  The default implementation handles some
 * validation and allows for custom event handlers.
 * TODO: provide custom validation for DVID.
*/
var JsonForm = React.createClass({
    getInitialState: function () {
        return {
            editor: null,
            validationReqs: 0
        };
    },
    initEditor: function (schemadata, initial_data) {
        var element, configdata, editorobj, schema;
        element = document.getElementById("editor");

        // settings for json-editor
        configdata = { theme: 'bootstrap3', iconlib: 'bootstrap3', no_additional_properties: true, disable_edit_json: true, disable_collapse: true, disable_properties: true, required_by_default: true};

        schema = {schema: schemadata};
        window.jQuery.extend(configdata, schema);
        editorobj = new JSONEditor(element, configdata);

        if (initial_data !== null) {
            editorobj.setValue(initial_data);
        }
        this.setState({editor: editorobj});
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.state.editor !== null) {
            this.state.editor.destroy();
        }
        this.initEditor(nextProps.schema, nextProps.initialData);
    },
    componentDidMount: function () {
        this.initEditor(this.props.schema, this.props.initialData);
    },
    handleClick: function () {
        var formdata,
            errors = this.state.editor.validate();
        if (errors.length > 0) {
            alert("Validation Fail: " + JSON.stringify(errors, null, 4));
            return;
        } 
        this.setState({failedCheck: false});
        
        // JSON object 
        formdata = this.state.editor.getValue();

        // iterate form schema and note special symbols
        var dvid_servers = [];
        var name_path = [];
        grabPathsToDVIDNames(this.props.schema, name_path, dvid_servers);

        if (dvid_servers.length == 0) {
            this.props.postCallback(this.state.editor.getValue(), null);
        } else {
            // set the number of outstanding validations so
            // that the form can wait until all requests are done
            this.setState({validationReqs: dvid_servers.length + this.state.validationReqs});

            this.state.editor.disable();
            // iterate data and check different endpoints
            for (var iter in dvid_servers) {
                var server_name = formdata,
                    schema_path = dvid_servers[iter];

                // grab object that points to dvid server
                for (var iter2 in schema_path) {
                    server_name = server_name[schema_path[iter2]];
                }

                var serverport = server_name.split(':');
                var server = serverport[0];
                var portnum = 80;
                if (serverport.length > 1) {
                    portnum = serverport[1];
                }
                var dvid_connection = dvid.connect({host: server, port: portnum});
                dvid_connection.serverInfo({
                    callback: function (data) {
                        if (!this.state.failedCheck && this.state.validationReqs == 1) {
                            this.props.postCallback(this.state.editor.getValue(), null);
                            
                            // don't need to re-enable since form will be destroyed
                            //this.state.editor.enable(); 
                        } else {
                            this.setState({validationReqs: this.state.validationReqs-1});
                        }
                    }.bind(this),
                    error: function (err) {
                        this.props.postCallback(this.state.editor.getValue(),
                            "Incorrect DVID server specified");
                        this.state.editor.enable();
                        this.setState({
                            failedCheck: true,
                            validationReqs: this.state.validationReqs-1        
                        });
                    }.bind(this)
                });
            }
        }
    },
    render: function () {
        // determined the element that anchors the json-editor
        if (this.state.validationReqs > 0) {
            return (
                    <div>
                    <div className="jsoneditor" id="editor"></div>
                    <button type="button" className="btn btn-default" onClick={this.handleClick} disabled>Submit </button>
                    </div>
            )
        } else {
            return (
                    <div>
                    <div className="jsoneditor" id="editor"></div>
                    <button type="button" className="btn btn-default" onClick={this.handleClick}>Submit </button>
                    </div>
            )
        }
    },
    componentWillUnmount: function () {
        this.state.editor.destroy();
    }
});

module.exports = JsonForm;
