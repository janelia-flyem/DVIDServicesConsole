"use strict";

var React = require('react');

var interfaceURI = "/interface"; 

var Help = React.createClass({
    getInitialState: function() {
        return {
            ramldata: ""
        };
    },
    componentDidMount: function() {
        $.ajax({
            type: "GET",
            url: this.props.address + interfaceURI,
            success: function (data) {
                if (this.isMounted()) {
                    this.setState({ramldata: data});
                } 
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div><pre>{this.state.ramldata}</pre></div>
        );

    }
});

module.exports = Help;
