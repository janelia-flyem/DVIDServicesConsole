"use strict";

var React = require('react');

var JobStatus = React.createClass({
    getInitialState: function () {
        return {
            finished: false,
            job_status: "Submitted Job",
            job_message: ""
        };
    },
    checkstatus: function () {
        // fetch data from callback on job state
        $.getJSON(this.props.jobCallback, function (data) {
            if (data) {
                if (data.job_status == "Finished") {
                    clearInterval(this.timer);
                    this.setState({finished: true,
                        job_status: data.job_status,
                        job_message: data.job_message
                    });
                } else {
                    this.setState({job_status: data.job_status,
                        job_message: data.job_message
                    });
                }
            }
        }.bind(this)); 
    },
    componentDidMount: function () {
        // time interval to query callbacks
        this.timer = setInterval(this.checkstatus, 5000);
    },
    componentWillUnmount: function () {
        if (!this.state.finished) {
            clearInterval(this.timer);
        }
    },
    render: function () {
        // TODO: add div that communicates with spark and add div for final status
        return (
            <div style={{margin: "10px"}}>
                <h2>Spark Web Status: <a href={this.props.sparkAddr}>{this.props.sparkAddr}</a></h2>
            <div />
            <div>
                <h2>Job State</h2>
                <h3>{this.state.job_status}</h3>
                <pre>{this.state.job_message}</pre>
            </div>
            </div>
        );
    }
});

module.exports = JobStatus;
