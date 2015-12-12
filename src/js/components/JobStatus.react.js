"use strict";

var React = require('react');
var SparkStatus = require('./SparkStatus.react');

var JobStatus = React.createClass({
    getInitialState: function () {
        return {
            finished: false,
            job_status: "Waiting",
            job_message: "",
            sparkAddr: "",
            sparkcallback: "",
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
                        sparkAddr: "",
                        sparkcallback: ""
                    });
                } else {
                    this.setState({job_status: data.job_status,
                        job_message: data.job_message, sparkAddr: data.sparkAddr,
                        runtime: data.runtime, sparkcallback: this.props.jobCallback
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
                    <h4>Spark Application Status: <a href={this.state.sparkAddr+":4040"}>{this.state.sparkAddr+":4040"}</a></h4>
                    <h4>Spark Master Status: <a href={this.state.sparkAddr+":8080"}>{this.state.sparkAddr+":8080"}</a></h4>
                </div>
            )
    
        }
        
        var pcolor = "panel-warning";
        if (this.state.job_status === "Finished") {
            pcolor = "panel-success";
        } else if (this.state.job_status === "Error") {
            pcolor = "panel-danger";
        }

        // TODO: add div that communicates with spark and add div for final status
        return (
            <div>
                <div className="panel panel-info">
                    <div className="panel-heading">Job Resources</div>
                    <div className="panel-body">
                        {sparkaddresses}
                        <h4>DVID Server Callback URI: {this.props.jobCallback}</h4>
                    </div>
                </div>
                <div className={"panel " + pcolor}>
                    <div className="panel-heading">Job Status</div>
                    <div className="panel-body">
                        <h4>{this.state.job_status}</h4>
                        <b>Time Elapsed: {this.state.runtime} seconds</b>
                        <pre className="pre-scrollable">{this.state.job_message}</pre>
                    </div>
                </div>
                 <div className={"panel " + pcolor}>
                    <div className="panel-heading">Spark Job Details</div>
                    <div className="panel-body">
                        <SparkStatus callBack={this.state.sparkcallback} /> 
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = JobStatus;
