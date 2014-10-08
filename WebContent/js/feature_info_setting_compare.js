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
 * This class handles feature info settings for the compare2maps view. it binds feature information to the iframe.
 *
 * @author Hannes Tressel, Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */

var markers;
var service_url, service_version, service_srs;
var markers2;
var service_url2, service_version2, service_srs2;
var featureInfoUrl, featureInfoUrl2;

/**
 * This method is used to register an event listener that sets the marker on the map, when the user has clicked into the map.
 * Further, the feature info response is initialized and embedded.
 *
 * @param time_info - string param that is set to "time", if the service is time enabled and empty if not.
 */

function bindFeatureControls(time_info) {
    //getting general information of web service
    var service_JSON, service_JSON2;

    wmsDescription_Store.fetchItemByIdentity({
        identity: "serviceDescriptionParam",
        onItem: function(item, request) {
            service_JSON = item;
        }
    });

    wmsDescription_Store2.fetchItemByIdentity({
        identity: "serviceDescriptionParam",
        onItem: function(item, request) {
            service_JSON2 = item;
        }
    });

    service_url = wmsDescription_Store.getValue(service_JSON, "finfo");
    service_version = wmsDescription_Store.getValue(service_JSON, "version");
    service_srs = wmsDescription_Store.getValue(service_JSON, "srs");

    service_url2 = wmsDescription_Store2.getValue(service_JSON2, "finfo");
    service_version2 = wmsDescription_Store2.getValue(service_JSON2, "version");
    service_srs2 = wmsDescription_Store2.getValue(service_JSON2, "srs");

    map.on("singleclick", function(evt) {
        last_event = evt.coordinate;
        map.getLayers().forEach(function(layer) {
            if (layer.getProperties().title === layer_Array[vis_layer_number].getProperties().title) {
                var resolution = map.getView().getResolution();
                var projection = map.getView().getProjection();
                var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                    "INFO_FORMAT": "text/html",
                });
                featureInfoUrl = source;
                if (typeof source != null) {
                    require(["dojo/dom-attr", "dojo/io-query"], function(domAttr, ioQuery) {
                        var sourceObject = ioQuery.queryToObject(source);
                        if (time_info === "time") {
                            var url = "featureInfo_compare.jsp?url=" + service_url + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + sourceObject.SRS + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + sourceObject.X + "&J=" + sourceObject.Y + "&time=" + sourceObject.time;
                            domAttr.set("featureInfo_frame1", "src", url);
                        } else {
                            var url = "featureInfo_compare.jsp?url=" + service_url + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + (typeof sourceObject.CRS != "undefined" ? sourceObject.CRS : sourceObject.SRS) + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + (typeof sourceObject.X != "undefined" ? sourceObject.X : sourceObject.I) + "&J=" + (typeof sourceObject.Y != "undefined" ? sourceObject.Y : sourceObject.J) + "&time=x";
                            domAttr.set("featureInfo_frame1", "src", url);
                        }
                    });
                }

                /* remove existant Overlays */
                map.getOverlays().forEach(function(overlay) {
                    map.removeOverlay(overlay);
                });

                map2.getOverlays().forEach(function(overlay) {
                    map2.removeOverlay(overlay);
                })

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

                var overlayElement2 = null;
                require(["dojo/dom-construct", "dojo/query"], function(domConstruct, domStyle) {
                    overlayElement2 = domConstruct.create("img", {
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

                var overlay2 = new ol.Overlay({
                    position: evt.coordinate,
                    element: overlayElement2
                });

                map.addOverlay(overlay);
                map2.addOverlay(overlay2);
            }
        });

        map2.getLayers().forEach(function(layer) {
            if (layer.getProperties().title === layer_Array2[vis_layer_number2].getProperties().title) {
                var resolution = map2.getView().getResolution();
                var projection = map2.getView().getProjection();
                var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                    "INFO_FORMAT": "text/html",
                });
                featureInfoUrl2 = source;
                if (typeof source != null) {
                    require(["dojo/dom-attr", "dojo/io-query"], function(domAttr, ioQuery) {
                        var sourceObject = ioQuery.queryToObject(source);
                        if (time_info === "time") {
                            var url = "featureInfo_compare.jsp?url=" + service_url2 + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + sourceObject.SRS + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + sourceObject.X + "&J=" + sourceObject.Y + "&time=" + sourceObject.time;
                            domAttr.set("featureInfo_frame2", "src", url);
                        } else {
                            var url = "featureInfo_compare.jsp?url=" + service_url2 + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + (typeof sourceObject.CRS != "undefined" ? sourceObject.CRS : sourceObject.SRS) + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + (typeof sourceObject.X != "undefined" ? sourceObject.X : sourceObject.I) + "&J=" + (typeof sourceObject.Y != "undefined" ? sourceObject.Y : sourceObject.J) + "&time=x";
                            domAttr.set("featureInfo_frame2", "src", url);
                        }
                    });
                }
            }
        });
    });

    map2.on("singleclick", function(evt) {
        last_event = evt.coordinate;
        map2.getLayers().forEach(function(layer) {
            if (layer.getProperties().title === layer_Array2[vis_layer_number2].getProperties().title) {
                var resolution = map2.getView().getResolution();
                var projection = map2.getView().getProjection();
                var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                    "INFO_FORMAT": "text/html",
                });
                featureInfoUrl2 = source;
                if (typeof source != null) {
                    require(["dojo/dom-attr", "dojo/io-query"], function(domAttr, ioQuery) {
                        var sourceObject = ioQuery.queryToObject(source);
                        if (time_info === "time") {
                            var url = "featureInfo_compare.jsp?url=" + service_url2 + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + sourceObject.SRS + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + sourceObject.X + "&J=" + sourceObject.Y + "&time=" + sourceObject.time;
                            domAttr.set("featureInfo_frame2", "src", url);
                        } else {
                            var url = "featureInfo_compare.jsp?url=" + service_url2 + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + (typeof sourceObject.CRS != "undefined" ? sourceObject.CRS : sourceObject.SRS) + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + (typeof sourceObject.X != "undefined" ? sourceObject.X : sourceObject.I) + "&J=" + (typeof sourceObject.Y != "undefined" ? sourceObject.Y : sourceObject.J) + "&time=x";
                            domAttr.set("featureInfo_frame2", "src", url);
                        }
                    });
                }

                /* remove existant Overlays */
                map.getOverlays().forEach(function(overlay) {
                    map.removeOverlay(overlay);
                });

                map2.getOverlays().forEach(function(overlay) {
                    map2.removeOverlay(overlay);
                })

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

                var overlayElement2 = null;
                require(["dojo/dom-construct", "dojo/query"], function(domConstruct, domStyle) {
                    overlayElement2 = domConstruct.create("img", {
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

                var overlay2 = new ol.Overlay({
                    position: evt.coordinate,
                    element: overlayElement2
                });

                map.addOverlay(overlay);
                map2.addOverlay(overlay2);
            }
        });

        map.getLayers().forEach(function(layer) {
            if (layer.getProperties().title === layer_Array[vis_layer_number].getProperties().title) {
                var resolution = map.getView().getResolution();
                var projection = map.getView().getProjection();
                var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                    "INFO_FORMAT": "text/html",
                });
                featureInfoUrl = source;
                if (typeof source != null) {
                    require(["dojo/dom-attr", "dojo/io-query"], function(domAttr, ioQuery) {
                        var sourceObject = ioQuery.queryToObject(source);
                        if (time_info === "time") {
                            var url = "featureInfo_compare.jsp?url=" + service_url + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + sourceObject.SRS + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + sourceObject.X + "&J=" + sourceObject.Y + "&time=" + sourceObject.time;
                            domAttr.set("featureInfo_frame1", "src", url);
                        } else {
                            var url = "featureInfo_compare.jsp?url=" + service_url + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + (typeof sourceObject.CRS != "undefined" ? sourceObject.CRS : sourceObject.SRS) + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + (typeof sourceObject.X != "undefined" ? sourceObject.X : sourceObject.I) + "&J=" + (typeof sourceObject.Y != "undefined" ? sourceObject.Y : sourceObject.J) + "&time=x";
                            domAttr.set("featureInfo_frame1", "src", url);
                        }
                    });
                }
            }
        });
    });
}