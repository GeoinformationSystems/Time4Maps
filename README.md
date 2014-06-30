Time4Maps
=========

The Web client TIME4MAPS has been developed to enable a simple visual analysis of such data without installation of a massive GIS or other software. TIME4MAPS shows spatio-temporal changes of environmental data. The data must be provided by an OGC WMS service (1.1.1 or 1.3.0). The interactive map client enables to select spatial and temporal extent of the map and to control the animated map with a time slider. A click on the map provides concrete information and values of the selected point for the actual time step.  

Live demo and further information is available at: http://sustainable-landmanagement.net/glues-geoportal/stories/time4maps.html 

## Structure

Time4Maps is written in Javascript and Java. The modules and their functionality are briefly described here.

* ``/WebContent`` - Browser part of the application (Javascript, User interface)  
* ``/src`` - Server components of the application (Java, Service requests and response processing)

## Installation

The basic installation steps are
* Download code form GitHub: ``git clone https://github.com/GeoinformationSystems/Time4Maps.git``
* Deploy the web archives in a servlet container (e.g. Apache Tomcat)
* Start application in web browser - e.g. http://localhost:8080/Time4Maps/ [index.jsp | start.jsp | plain.jsp ] ?url= <yourwms> &version= <yourversion> & layer= <yourcommaseparatedlayers> (start.jsp contains project logos, index.jsp does not contain logos, plain.jsp contains adaptable design (splitter); parameters layer and version are optional - if you do not set these params version will be set to 1.1.1 and layer choose will be shown)

## Configuration

A further configuration is not needed. If you like to visualize a certain (fixed) wms you can set the parameters in the index/start/plain.jsp. Configuration of the base map, spatial extent and spatial reference system is set in map_setting.js.

## Javascript Libraries

The website module uses a collection of Javascript libraries:
 
* Dojo 1.9, https://github.com/dojo/dojo/blob/master/LICENSE - BSD License or Academic Free License
* Openlayers 3, http://trac.osgeo.org/openlayers/wiki/Licensing - Modified BSD License 

## Java Libraries

The server component uses a collection of Java libraries:

* commons-logging-1.1.1 - Apache License  
* httpclient-4.1.1 - Apache License
* httpcore-4.1 - Apache License
* jackson-all.1.8.2, http://docs.codehaus.org/display/JACKSON/Home - Apache License 
* joda-time-1.6.2, http://joda-time.sourceforge.net/license.html - Apache License
* jstl
* xalan

 

## Contact

Christin Henzen (christin.henzen@tu-dresden.de)
