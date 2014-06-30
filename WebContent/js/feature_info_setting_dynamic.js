/**
 * Copyright 2012 Geoinformation Systems, TU Dresden
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */

/**
 * This class handles feature info requests and preparing response for gui.
 * 
 * @author Christin Henzen, Hannes Tressel. Professorship of Geoinformation Systems
 */
var markers;
var service_url, service_version, service_srs;

var map_width = 990;
var map_height = 660;

/**
 * This method is used to register an event listener that sets the marker on the map, when the user has clicked into the map.
 * Further, the feature info response is initialized and embedded.
 *
 * @param time_info - string param that is set to "time", if the service is time enabled and empty if not.
 */
var infoControls;

function bindFeatureControls(time_info) {
    //getting general information of web service
    var service_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "serviceDescriptionParam",
        onItem: function(item, request) {
            service_JSON = item;
        }
    });
    service_url = wmsDescription_Store.getValue(service_JSON, "url");
    service_version = wmsDescription_Store.getValue(service_JSON, "version");
    service_srs = wmsDescription_Store.getValue(service_JSON, "srs");

    map.on("singleclick", function(evt) {
        map.getLayers().forEach(function(layer) {
            if (layer.getProperties().title === layer_Array[vis_layer_number].getProperties().title) {
                var resolution = map.getView().getResolution();
                var projection = map.getView().getProjection();
                var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                    "INFO_FORMAT": "text/html",
                });
 
                /* remove existing Overlays */
                map.getOverlays().forEach(function(overlay) {
                    map.removeOverlay(overlay);
                });

                /*create overlay image*/
                var overlayElement = null;
                require(["dojo/dom-construct", "dojo/query"], function(domConstruct, domStyle) {
                    overlayElement = domConstruct.create("img", {
                        src: 'js/ol3/resources/marker-blue.png',
                        style: {
                            position: "absolute",
                            top: "-25px",
                            left: "-10.5px",
                            color: "darkslateblue"
                        }
                    });
                });

                /* create overlay */
                var overlay = new ol.Overlay({
                    position: evt.coordinate,
                    element: overlayElement
                });

                map.addOverlay(overlay);
            }
        });
    });
}