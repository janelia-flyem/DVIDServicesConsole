"use strict";

window.$ = window.jQuery = require('jquery');

var DVIDServices = require('./components/DVIDServices.react');

require('bootstrap');
var React = require('react');

// load css that contains bootstrap
var filename = "css/main.min.css";
var fileref = document.createElement("link");
fileref.setAttribute("rel", "stylesheet");
fileref.setAttribute("type", "text/css");
fileref.setAttribute("href", filename);
document.getElementsByTagName("head")[0].appendChild(fileref);

// sample application to test component
var serviceloc = "http://127.0.0.1:8000/api/node/5b7/service/key";

/* 
 * Renders component just to the document body.
 * TODO: render to a specified div id with data property
*/
function loadInterface() {
    React.render(<DVIDServices service={serviceloc} />, document.body);
}

// do not render component until
if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', loadInterface);
} else { 
    $(document).ready(loadInterface);
}





