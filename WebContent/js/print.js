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
 * This class handles printing functions.
 * 
 * @author Hannes Tressel. Professorship of Geoinformation Systems
 */
function openPrintPreview() {
    require(["dojo/_base/window", "dojo/dom-construct", "dojox/gfx", "dojo/io-query", "dojo/dom-style", "dojo/dom"], function(win, domConstruct, gfx, ioQuery, domStyle, dom) {
        var pWindowSettings = "width=" + window.screen.width / 1.3 + ", height=" + window.screen.height / 1.3 + ", scrollbars=yes";
        var pWindow = window.open("", "", pWindowSettings);
        var map2_ = false;
        if (dom.byId("map2") != null) {
            map2_ = true;
        }

        var featureInfo = dom.byId("featureInfo_frame").contentDocument.body.innerHTML;
        var featureInfo_height = domStyle.get("featureInfo_frame", "height") + 10;

        var service_JSON = null;
        wmsDescription_Store.fetchItemByIdentity({
            identity: "serviceDescriptionParam",
            onItem: function(item, request) {
                service_JSON = item;
            }
        });

        /* catch legendImage before change context */
        var legendImage = {
            src: dom.byId("legend_frame").src,
            width: domStyle.get("legend_frame", "width"),
            height: domStyle.get("legend_frame", "height")
        };

        if (map2_) {
            var legendImage2 = {
                src: dom.byId("legend_frame2").src,
                width: domStyle.get("legend_frame2", "width"),
                height: domStyle.get("legend_frame2", "height")
            };
        }

        pWindow.onunload = function() {
            win.setContext(window, window.document);
        };

        /*focus popup*/
        win.setContext(pWindow, pWindow.document);

        domConstruct.create("h1", {
            innerHTML: "Name of this service: " + service_JSON.title[0],
            style: {
                fontFamiliy: "'Myriad Pro','Helvetica Neue',Helvetica,Arial,Sans-Serif",
                textShadow: "0px 1px 1px silver"
            }
        }, win.body());

        domConstruct.create("h3", {
            innerHTML: "Abstract of this service: " + service_JSON.abstractText[0],
            style: {
                fontFamiliy: "'Myriad Pro','Helvetica Neue',Helvetica,Arial,Sans-Serif",
                textShadow: "0px 1px 1px silver"
            }
        }, win.body());

        /* get Map Image */
        var mapImage = null;
        var bbox = "";
        var imageUrl = [];

        map.getLayers().forEach(function(layer) {

            if (layer instanceof ol.layer.Image && layer.getVisible()) {
                bbox = "";
                var extent = map.getView().getView2D().calculateExtent(map.getSize());
                for (var i in extent) {
                    bbox = bbox + extent[i].toString() + ",";
                }
                bbox = bbox.substring(0, bbox.length - 1);

                var resolution = map.getView().getResolution();
                var pixelRatio = 1;
                var projection = map.getView().getProjection();
                mapImage = layer.getSource().getImage(extent, resolution, pixelRatio, projection);
                imageUrl.push({
                    url: mapImage.image_.src.substring(0, mapImage.image_.src.indexOf("BBOX")) + ioQuery.objectToQuery({
                        BBOX: bbox
                    }),
                    width: mapImage.image_.width,
                    height: mapImage.image_.height
                });
            }
        });

        if (map2_) {
            var mapImage2 = null;
            var bbox2 = "";
            var imageUrl2 = [];

            map2.getLayers().forEach(function(layer) {

                if (layer instanceof ol.layer.Image && layer.getVisible()) {
                    bbox2 = "";
                    var extent2 = map2.getView().getView2D().calculateExtent(map2.getSize());
                    for (var i in extent2) {
                        bbox2 = bbox2 + extent2[i].toString() + ",";
                    }
                    bbox2 = bbox2.substring(0, bbox2.length - 1);

                    var resolution2 = map2.getView().getResolution();
                    var pixelRatio2 = 1;
                    var projection2 = map2.getView().getProjection();
                    mapImage2 = layer.getSource().getImage(extent2, resolution2, pixelRatio2, projection2);
                    imageUrl2.push({
                        url: mapImage2.image_.src.substring(0, mapImage2.image_.src.indexOf("BBOX")) + ioQuery.objectToQuery({
                            BBOX: bbox2
                        }),
                        width: mapImage2.image_.width,
                        height: mapImage2.image_.height
                    });
                }
            });
        }

        domConstruct.create("div", {
            id: "leftItemBox",
            style: {
                width: (58 * (window.screen.width / 1.3)) / 100 + "px",
                height: "400px",
                float: "left",
                marginLeft: "10px",
                backgroundColor: "lightgray"
            }
        }, win.body());

        domConstruct.create("div", {
            id: "rightItemBox",
            style: {
                width: (36 * (window.screen.width / 1.3)) / 100 + "px",
                height: "400px",
                float: "right",
                marginRight: "10px"
            }
        }, win.body());


        /*create & display map and overlay image */

        domConstruct.create("div", {
            id: "mapSurface",
            style: {
                width: domStyle.get("leftItemBox", "width"),
                height: "400px",
                margin: "0 auto",
            }
        }, "leftItemBox");

        var mapSurface = gfx.createSurface("mapSurface", domStyle.get("leftItemBox", "width"), 400);
        for (var i in imageUrl) {
            mapSurface.createImage({
                x: 0,
                y: 0,
                width: (domStyle.get("leftItemBox", "width") / imageUrl[i].width) * imageUrl[i].width,
                height: (400 / imageUrl[i].height) * imageUrl[i].height,
                src: imageUrl[i].url
            });
        }

        /* if overlays are available...*/
        map.getOverlays().forEach(function(overlay) {
            mapSurface.createImage({
                x: ((domStyle.get("leftItemBox", "width") / map.getSize()[0]) * map.getPixelFromCoordinate(overlay.getProperties().position)[0]) - 21 / 2,
                y: ((400 / map.getSize()[1]) * map.getPixelFromCoordinate(overlay.getProperties().position)[1]) - 25,

                width: overlay.values_.element.width,
                height: overlay.values_.element.height,
                src: overlay.values_.element.src
            });
        });


        /* add legend image */
        var legendSurface = gfx.createSurface("rightItemBox", domStyle.get("rightItemBox", "width"), 400);
        if (legendImage.width > domStyle.get("rightItemBox", "width")) {
            legendSurface.createImage({
                x: 0,
                y: 0,
                width: (domStyle.get("rightItemBox", "width") / legendImage.width) * legendImage.width + "px",
                height: legendImage.height + "px",
                src: legendImage.src
            });

        } else {
            legendSurface.createImage({
                x: 0,
                y: 0,
                width: legendImage.width + "px",
                height: legendImage.height + "px",
                src: legendImage.src
            });
        }

        if (map2_) {
            domConstruct.create("div", {
                id: "leftItemBox2",
                style: {
                    width: (58 * (window.screen.width / 1.3)) / 100 + "px",
                    height: "400px",
                    float: "left",
                    marginTop: "10px",
                    marginLeft: "10px",
                    backgroundColor: "lightgray"
                }
            }, win.body());

            domConstruct.create("div", {
                id: "rightItemBox2",
                style: {
                    width: (36 * (window.screen.width / 1.3)) / 100 + "px",
                    height: "400px",
                    float: "right",
                    marginTop: "10px",
                    marginRight: "10px"
                }
            }, win.body());


            /*create & display map and overlay image */

            domConstruct.create("div", {
                id: "mapSurface2",
                style: {
                    width: domStyle.get("leftItemBox2", "width"),
                    height: "400px",
                    margin: "0 auto",
                }
            }, "leftItemBox2");

            var mapSurface2 = gfx.createSurface("mapSurface2", domStyle.get("leftItemBox2", "width"), 400);
            for (var i in imageUrl2) {
                mapSurface2.createImage({
                    x: 0,
                    y: 0,
                    width: (domStyle.get("leftItemBox2", "width") / imageUrl2[i].width) * imageUrl2[i].width,
                    height: (400 / imageUrl2[i].height) * imageUrl2[i].height,
                    src: imageUrl2[i].url
                });
            }

            /* if overlays are available...*/
            map2.getOverlays().forEach(function(overlay2) {
                mapSurface2.createImage({
                    x: ((domStyle.get("leftItemBox2", "width") / map2.getSize()[0]) * map2.getPixelFromCoordinate(overlay2.getProperties().position)[0]) - 21 / 2,
                    y: ((400 / map2.getSize()[1]) * map2.getPixelFromCoordinate(overlay2.getProperties().position)[1]) - 25,

                    width: overlay2.values_.element.width,
                    height: overlay2.values_.element.height,
                    src: overlay2.values_.element.src
                });
            });


            /* add legend image */
            var legendSurface2 = gfx.createSurface("rightItemBox2", domStyle.get("rightItemBox2", "width"), 400);
            if (legendImage2.width > domStyle.get("rightItemBox2", "width")) {
                legendSurface2.createImage({
                    x: 0,
                    y: 0,
                    width: (domStyle.get("rightItemBox2", "width") / legendImage2.width) * legendImage2.width + "px",
                    height: legendImage2.height + "px",
                    src: legendImage2.src
                });

            } else {
                legendSurface2.createImage({
                    x: 0,
                    y: 0,
                    width: legendImage2.width + "px",
                    height: legendImage2.height + "px",
                    src: legendImage2.src
                });
            }
        }

        domConstruct.create("div", {
            id: "featureInfo",
            style: {
                marginTop: "440px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "98%"
            }
        }, win.body());

        if (featureInfo != "Click on the map to get feature information.") {
            domConstruct.create("h3", {
                id: "featureInfoLabel",
                innerHTML: "Feature Information",
                style: {

                }
            }, "featureInfo");

            domConstruct.create("div", {
                innerHTML: featureInfo
            }, "featureInfo");
        }
        /*
         
         */

        domConstruct.create("div", {
            id: "btnArea",
            style: {
                display: "block",
                position: "relative",
                top: featureInfo_height + "px",
                width: "100%",
                height: "30px"
            }
        }, win.body());

        domConstruct.create("button", {
            type: "button",
            innerHTML: "Print",
            style: {
                position: "absolute",
                left: "10px",
                width: "100px",
                height: "25px"
            },
            onclick: function() {
                pWindow.print();
            }
        }, "btnArea");

        domConstruct.create("button", {
            type: "button",
            innerHTML: "Cancel",
            style: {
                position: "absolute",
                width: "100px",
                height: "25px",
                left: "160px"
            },
            onclick: function() {
                pWindow.close();
            }
        }, "btnArea");



        //pWindow.close();
    });

}