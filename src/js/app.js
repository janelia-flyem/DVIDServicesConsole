jQuery = require('jquery');
require('bootstrap');
//var React = require('react');
//var JSONEditor = require('json-editor');
require('json-editor');


var schemadata = '\
{ "$schema": "http://json-schema.org/schema#", \
  "title": "Tool to Create DVID blocks from image slices",\
    "type": "object",\
      "properties": {\
              "dvid-server": {\
                        "description": "location of DVID server",\
                              "type": "string"\
                                      },\
              "uuid": { "type": "string" },\
              "label-name": {\
                        "description": "DVID data instance pointing to label blocks",\
                          "type": "string"\
                                  },\
              "roi": {\
                        "description": "name of DVID ROI for given label-name",\
                              "type": "string"\
                                      },\
              "graph-name": {\
                        "description": "destination name of DVID labelgraph",\
                              "type": "string"\
                                      },\
              "graph-builder-exe": {\
                        "description": "name of executable that will build graph",\
                            "type": "string"\
                                      },\
                  "chunk-size": {\
                        "description": "size of chunks to be processed",\
                              "type": "integer",\
                                    "default": 256\
                                            }\
                },\
        "required" : ["dvid-server", "uuid", "label-name", "roi", "graph-name"]\
}';

// load css
var filename = "css/main.min.css";
var fileref=document.createElement("link");
fileref.setAttribute("rel", "stylesheet");
fileref.setAttribute("type", "text/css");
fileref.setAttribute("href", filename);
document.getElementsByTagName("head")[0].appendChild(fileref);

var element = document.getElementById('editor');
var editor = new JSONEditor(element, {schema: 
        { "$schema": "http://json-schema.org/schema#",
        "title": "Tool to Create DVID blocks from image slices",
        "type": "object",
        "properties": {
        "group1" : {
            "type": "object",
            "properties": {
        "dvid-server": {
        "description": "location of DVID server",
        "type": "string"
        },
        "uuid": { "type": "string" },
        "label-name": {
        "description": "DVID data instance pointing to label blocks",
        "type": "string"
        },
        "roi": {
        "description": "name of DVID ROI for given label-name",
        "type": "string"
        },
        "graph-name": {
        "description": "destination name of DVID labelgraph",
        "type": "string"
        },
        "graph-builder-exe": {
            "description": "name of executable that will build graph",
            "type": "string"
        },
        "chunk-size": {
            "description": "size of chunks to be processed",
            "type": "integer",
            "default": 256,
            "minimum": 50
        }
        }
        },
        "group2" : {
            "type": "object",
            "properties": {
        "dvid-server": {
        "description": "location of DVID server",
        "type": "string"
        },
        "uuid": { "type": "string" },
        "label-name": {
        "description": "DVID data instance pointing to label blocks",
        "type": "string"
        },
        "roi": {
        "description": "name of DVID ROI for given label-name",
        "type": "string"
        },
        "graph-name": {
        "description": "destination name of DVID labelgraph",
        "type": "string"
        },
        "graph-builder-exe": {
            "description": "name of executable that will build graph",
            "type": "string"
        },
        "chunk-size": {
            "description": "size of chunks to be processed",
            "type": "integer",
            "default": 256
        }
        }
        }
        }
        }
, theme: 'bootstrap3', iconlib: 'bootstrap3', no_additional_properties: true, disable_edit_json: true, disable_collapse: true, disable_properties: true});


