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
        var github_addr = "https://github.com/janelia-flyem/DVIDServicesConsole";

        return (
            <div>
                <h3>For user documentation: <a href={github_addr}>{github_addr}</a></h3>

                <h3>RAML Specification for Job Server</h3>

                <pre>{this.state.ramldata}</pre>
            </div>
        );

    }
});

module.exports = Help;
