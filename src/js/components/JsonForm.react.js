//"use strict";

var React = require('react');
jQuery = require('jquery');

/*global JSONEditor */
require('json-editor');

var JsonForm = React.createClass({
    componentDidMount: function () {
        var element, configdata, editorobj;

        element = document.getElementById("editor");

        configdata = { theme: 'bootstrap3', iconlib: 'bootstrap3', no_additional_properties: true, disable_edit_json: true, disable_collapse: true, disable_properties: true};

        jQuery.extend(configdata, this.props.schema);

        editorobj = new JSONEditor(element, configdata);
        this.setState({editor: editorobj});
    },
    render: function () {
        return (
            <div className="jsoneditor" id="editor"></div>
        );
    }
});

module.exports = JsonForm;
