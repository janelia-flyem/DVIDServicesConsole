"use strict";

var React = require('react');

var JobStatus = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        // TODO: add div that communicates with spark and add div for final status
        return (
            <div style={{margin: "10px"}}>
            <h2>Spark Web Status: <a href={this.props.sparkAddr}>{this.props.sparkAddr}</a></h2>
            <div />
            <div />
            </div>
        );
} 

});

module.exports = JobStatus;
