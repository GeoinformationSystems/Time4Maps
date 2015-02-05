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
var featureInfoUrl;

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
    service_url = wmsDescription_Store.getValue(service_JSON, "finfo");
    service_version = wmsDescription_Store.getValue(service_JSON, "version");
    service_srs = wmsDescription_Store.getValue(service_JSON, "srs");

    map.on("singleclick", function(evt) {
        grabFeatureInfo(evt);
    });
}

function grabFeatureInfo(evt) {
    require(["dojo/dom-attr", "dojo/request/iframe", "dojo/io-query", "dojo/dom-construct", "dojo/query"], function(domAttr, iframe, ioQuery, domConstruct, query) {
        if (domAttr.get("featureInfoAllLayer", "checked")) {
            manageFeatureInfoWindow();
            for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
                var layer = map.getLayers().array_[i];
                if (layer.getVisible()) {
                    last_event = evt.coordinate;
                    var resolution = map.getView().getResolution();
                    var projection = map.getView().getProjection();
                    var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                        "INFO_FORMAT": "text/html",
                    });
                    featureInfoUrl = source;
                    if (typeof source != null) {

                        var sourceObject = ioQuery.queryToObject(source);
                        var url = "featureInfo_compare.jsp?url=" + service_url + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + (typeof sourceObject.CRS != "undefined" ? sourceObject.CRS : sourceObject.SRS) + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + (typeof sourceObject.X != "undefined" ? sourceObject.X : sourceObject.I) + "&J=" + (typeof sourceObject.Y != "undefined" ? sourceObject.Y : sourceObject.J) + "&time=" + (typeof sourceObject.time != "undefined" ? sourceObject.time : "x");

                        iframe(url, {
                            handleAs: "html"
                        }).then(function(html) {
                                domConstruct.create("div", {
                                    id: "featureInfo_multi",
                                    innerHTML: query("#featureinfo", html.body)[0].innerHTML,
                                    style: {
                                        "display": "inline-block",
                                        "margin": "0 5px 10px 5px"
                                    }
                                }, "featureInfo_div");
                            },
                            function(error) {
                                console.log("Fehler beim Auslesen der FeatureInfo :" + error);
                            });
                    }
                }
            }
            /* remove existant Overlays */
            map.getOverlays().forEach(function(overlay) {
                map.removeOverlay(overlay);
            });

            /* create overlay image */
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
        } else {
            manageFeatureInfoWindow();
            for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
                var layer = map.getLayers().array_[i];
                if (layer.getVisible()) {
                    last_event = evt.coordinate;
                    var resolution = map.getView().getResolution();
                    var projection = map.getView().getProjection();
                    var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                        "INFO_FORMAT": "text/html",
                    });
                    featureInfoUrl = source;
                    if (typeof source != null) {
                        require(["dojo/dom-attr", "dojo/io-query"], function(domAttr, ioQuery) {
                            var sourceObject = ioQuery.queryToObject(source);
                            var url = "featureInfo_compare.jsp?url=" + service_url + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + (typeof sourceObject.CRS != "undefined" ? sourceObject.CRS : sourceObject.SRS) + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + (typeof sourceObject.X != "undefined" ? sourceObject.X : sourceObject.I) + "&J=" + (typeof sourceObject.Y != "undefined" ? sourceObject.Y : sourceObject.J) + "&time=" + (typeof sourceObject.time != "undefined" ? sourceObject.time : "x");
                            domAttr.set("featureInfo_frame", "src", url);
                        });
                    }

                    /* remove existant Overlays */
                    map.getOverlays().forEach(function(overlay) {
                        map.removeOverlay(overlay);
                    });

                    /* create overlay image */
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
                    break;
                }
            }
        }
    });
}

function manageFeatureInfoWindow() {
    require(["dojo/dom-attr", "dojo/dom-style", "dojo/dom-construct", "dojo/query"], function(domAttr, domStyle, domConstruct, query) {
        if (domAttr.get("featureInfoAllLayer", "checked")) {
            query("#featureInfo_div > div").forEach(domConstruct.destroy);
            domStyle.set("featureInfo_frame", "display", "none");
            domStyle.set("featureInfo_div", "overflow", "auto");

        } else {
            query("#featureInfo_div > div").forEach(domConstruct.destroy);
            domStyle.set("featureInfo_div", "overflow", "auto");
            domStyle.set("featureInfo_frame", "display", "block");

        }
    });
}