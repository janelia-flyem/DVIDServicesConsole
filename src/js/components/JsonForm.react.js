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
    componentDidMount: function () {
        var element, configdata, editorobj, schema;

        element = document.getElementById("editor");

        // settings for json-editor
        configdata = { theme: 'bootstrap3', iconlib: 'bootstrap3', no_additional_properties: true, disable_edit_json: true, disable_collapse: true, disable_properties: true};

        schema = {schema: this.props.schema};
        window.jQuery.extend(configdata, schema);

        editorobj = new JSONEditor(element, configdata);
        this.setState({editor: editorobj});
    },
    render: function () {
        // determined the element that anchors the json-editor
        return (
            <div className="jsoneditor" id="editor"></div>
        );
    }
});

module.exports = JsonForm;
