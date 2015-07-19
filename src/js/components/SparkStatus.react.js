"use strict";

var React = require('react');

//var apiURI = ":4040/api/v1/applications"
var apiURI = "/api/v1/applications"

var SparkStatus = React.createClass({
    getInitialState: function () {
        return {
            sparkJobInfo : null,
            appName : "",
            appId: ""
        };
    },
    findAppName: function(callBack) {
        $.getJSON(callBack+apiURI, function (data) {
            if (data) {
                //alert(JSON.stringify(data));
                // get name for app
                var appName = data[0].name;
                var appId = data[0].id;
                //alert(appName);
                //var appName = encodeURIComponent(appNameSp)
                this.setState({appName: appName, appId: appId});
            }
        }.bind(this));
    },
    checkstatus: function () {
        // fetch spark info from server if available
        if (this.props.callBack === "") {
            return;
        }
        if (this.state.appName === "") {
            this.findAppName(this.props.callBack);
        } else {
            var req = '/' + encodeURIComponent(this.state.appId) + '/jobs';
            $.getJSON(this.props.callBack+apiURI+req, 
                    function (data) {
                if (data) {
                    this.setState({sparkJobInfo: data});
                }
            }.bind(this)); 
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.callBack !== "") {
            this.findAppName(nextProps.callBack);
        } 
    },
    componentDidMount: function () {
        // time interval to query callbacks
        this.timer = setInterval(this.checkstatus, 3000);
    },
    componentWillUnmount: function () {
        if (!this.state.finished) {
            clearInterval(this.timer);
        }
    },
    extractSeconds: function(datastr) {
        
    },
    render: function () {
        // App Name
        // number of active tasks
        // for each job   
            // job number (x stages): first word/file name
            // job progress bar
            // (task/total tasks) elapsed time
 
        var activeTasks = 0;
        var jobinfo = <div />;
        if (this.state.sparkJobInfo) {
            activeTasks = this.state.sparkJobInfo[0].numActiveTasks;
            jobinfo = (
                <div>
                {this.state.sparkJobInfo.map(function (val) {
                    var namearr = val.name.split(' ');
                    var name = namearr[0] + ' at ';
                    var last = namearr[namearr.length-1];
                    var lastarr = last.split('/');
                    name += lastarr[lastarr.length-1];
                    var time_message = "";
                    if ('completionTime' in val) {
                        var start = val.submissionTime;
                        var finish = val.completionTime;
                        var startsplit = start.split('T')[1].split('.')[0].split(':');
                        var finishsplit = finish.split('T')[1].split('.')[0].split(':');
                        var shr = parseInt(startsplit[0]);
                        var smin = parseInt(startsplit[1]);
                        var ssec = parseInt(startsplit[2]);
                        var fhr = parseInt(finishsplit[0]);
                        var fmin = parseInt(finishsplit[1]);
                        var fsec = parseInt(finishsplit[2]);
                        // adjust for 24 hour clock
                        if (fhr < shr) {
                            fhr += 24;
                        }
                        var total_time = (fhr-shr)*60*60 + (fmin-smin)*60 + (fsec-ssec);
                        time_message = "Time: " + String(total_time) + ' seconds'
                    }

                    var completenum = String(Math.floor(parseFloat(val.numCompletedTasks)/parseFloat(val.numTasks)*100));

                    return (
                        <div>
                            Job {val.jobId} ({val.stageIds.length} stages): {name} {time_message} 
                            <div className="progress">
                              <div className="progress-bar" role="progressbar" aria-valuenow={completenum} aria-valuemin="0" aria-valuemax="100" style={{width: completenum+"%"}}>
                              {val.numCompletedTasks}/{val.numTasks}
                              </div>
                            </div>
                        </div>
                    );        
                })}
                </div>
            );

        }

        var active = <div />;
        if (activeTasks > 0) {
            active = <div>Active Tasks: {activeTasks}</div>; 
        } 
   
        return (
            <div>
            Application: {this.state.appName}
            {active} 
            {jobinfo}
            </div>
        )        
    }
});

module.exports = SparkStatus;
