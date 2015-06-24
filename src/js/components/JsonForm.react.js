"use strict";

var React = require('react');

window.$ = window.jQuery = require('jquery');

/*global JSONEditor */
require('json-editor');

/*
 * Wraps json-editor code which takes a schema and produces
 * an HTML web form.  The default implementation handles some
 * validation and allows for custom event handlers.
 * TODO: provide custom validation for DVID.
*/
var JsonForm = React.createClass({
    getInitialState: function () {
        return {
            editor: null
        };
    },
    initEditor: function (schemadata) {
        var element, configdata, editorobj, schema;
        element = document.getElementById("editor");

        // settings for json-editor
        configdata = { theme: 'bootstrap3', iconlib: 'bootstrap3', no_additional_properties: true, disable_edit_json: true, disable_collapse: true, disable_properties: true, required_by_default: true};

        schema = {schema: schemadata};
        window.jQuery.extend(configdata, schema);
        editorobj = new JSONEditor(element, configdata);
        if (this.props.initialData !== null) {
            editorobj.setValue(this.props.initialData);
        }
        this.setState({editor: editorobj});
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.state.editor !== null) {
            this.state.editor.destroy();
        }
        this.initEditor(nextProps.schema);
    },
    componentDidMount: function () {
        this.initEditor(this.props.schema);
    },
    handleClick: function () {
        var errors = this.state.editor.validate();
        if (errors.length > 0) {
            alert("Validation Fail: " + JSON.stringify(errors, null, 4));
        } else {
            //alert(JSON.stringify(this.state.editor.getValue(), null, 4));
            this.props.postCallback(this.state.editor.getValue());
        }
    },
    render: function () {
        // determined the element that anchors the json-editor
        return (
            <div>
                <div className="jsoneditor" id="editor"></div>
                <button type="button" className="btn btn-default" onClick={this.handleClick}>Submit </button>
            </div>
        );
    },
    componentWillUnmount: function () {
        this.state.editor.destroy();
    }
});

module.exports = JsonForm;
