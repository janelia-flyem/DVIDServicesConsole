"use strict";

var React = require('react');

var JobStatus = React.createClass({
    getInitialState: function () {
        return {
            finished: false,
            job_status: "Waiting",
            job_message: "",
            sparkAddr: ""
        };
    },
    checkstatus: function () {
        // fetch data from callback on job state
        $.getJSON(this.props.jobCallback, function (data) {
            if (data) {
                if (data.job_status == "Finished" || data.job_status == "Error") {
                    clearInterval(this.timer);
                    this.setState({finished: true,
                        job_status: data.job_status,
                        job_message: data.job_message,
                        runtime: data.runtime,
                        sparkAddr: ""
                    });
                } else {
                    this.setState({job_status: data.job_status,
                        job_message: data.job_message, sparkAddr: data.sparkAddr,
                        runtime: data.runtime
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
        // ?! add spark query module
        var sparkaddresses = <div />
        if (this.state.sparkAddr != "") {
            sparkaddresses = (
                <div>
                    <h3>Spark Application Status: <a href={this.state.sparkAddr+":4040"}>{this.state.sparkAddr+":4040"}</a></h3>
                    <h3>Spark Master Status: <a href={this.state.sparkAddr+":8080"}>{this.state.sparkAddr+":8080"}</a></h3>
                </div>
            )
    
        }

        // TODO: add div that communicates with spark and add div for final status
        return (
            <div style={{margin: "10px"}}>
                {sparkaddresses}
                <h3>DVID Server Callback URI: {this.props.jobCallback}</h3>
            <div>
                <h2>Job State</h2>
                <h3>{this.state.job_status}</h3>
                <b>Time Elapsed: {this.state.runtime} seconds</b>
                <pre>{this.state.job_message}</pre>
            </div>
            </div>
        );
    }
});

module.exports = JobStatus;
