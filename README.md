# DVIDServicesConsole [![Picture](https://raw.github.com/janelia-flyem/janelia-flyem.github.com/master/images/HHMI_Janelia_Color_Alternate_180x40.png)](http://www.janelia.org)

##Web front-end for submitting Spark batch services that run on DVID

This front-end javascript web-app that interfaces with different spark services available through the [DVIDSparkServices](https://github.com/janelia-flyem/DVIDSparkServices) tool that provides algorithm for large data algorithms in the domain of EM Connectomics ([Fly EM project](https://www.janelia.org/project-team/fly-em) with a focus on algorithms using the [DVID](https://github.com/janelia-flyem/dvid) datastore..  The goal is to make interaction with that command-line tool easier and to provide job submission feedback via the new Spark REST API (>=1.4).  

This package
requires a Spark Job server/manager to be implemented as in the [DVIDServicesServer](https://github.com/janelia-flyem/DVIDServicesServer) to actually perform the Job submission.

## Installation and Use

The package provides a 'dist' directory.  If you are just using the static javascript, then just put the *contents* of the dist directory into your root server directory.  An example of how to load the application can be seen in src/index.html.  Just include the JS file js/bundle.min.js (and the corresponding *css* and *fonts* if they are not located at the root) and a div with id="DVIDServicesWidget" and the location of the server, such as the one provided in DVIDServicesServer.  For example:

    <html>                                                            
    <head>
      <title> My Service Console </title>
      <script src="js/bundle.js"></script>
    </head>
    <body>
       <div id="DVIDServicesWidget" data-serviceloc="http://dvidservicesserver" />
    </body>
    </html>

**Note: that if you are using the DVIDServicesServer, it can serve the dist directory for you.**

Instructions for developer installation below.

## User Notes

This app performs three primary functions

* Exploration of available services in DVIDSparkServices
* Submission of a service request
* Monitoring and logging of service request

The user is presented with a drop down that should have a list of available services.  After selecting a service, a web-form is automatically created from the service interface.  The user should fill out the fields and then submit.  The job is submitted to the server and will periodically query its status.

The exact JSON query made to the service is recorded in the console.

The snapshot belows shows a submitted job receiving feedback on the status of a Spark Job

![Picture](https://raw.github.com/janelia-flyem/DVIDServicesConsole/master/images/submittedscreenshot.png)

## Developer Notes

This app was designed as an NPM package and uses Grunt.

### Installation

To modify the library, build from src, and create a distribution:

    % npm install
    % grunt
    % grunt dist

### Architectural Notes

The package was designed using Facebook's [React](http://facebook.github.io/react/) to allow easy sub-component reuse.  Currently, the app was designed standalone but individual components could be exposed.

The app uses [json-editor](https://github.com/jdorn/json-editor) to parse interface specifications in json schema.  DVIDServicesConsole wraps json-editor into a React component (also adding some custom form validation logic), so that it works well with the other React components.


## TODO
* Provide better form validation handling especially for DVID datatypes.
* Provide an email when job is complete option
* Get updated Spark application status after the application finishes

