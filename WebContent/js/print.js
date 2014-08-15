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
    require(["dojo/_base/window", "dojo/dom-construct", "dojox/gfx", "dojo/io-query", "dojo/dom-style", "dojo/dom", "dojo/query", "dojo/NodeList-traverse"], function(win, domConstruct, gfx, ioQuery, domStyle, dom, query) {
        var pWindowSettings = "width=" + window.screen.width / 1.3 + ", height=" + window.screen.height / 1.3 + ", scrollbars=yes";
        var pWindow = window.open("", "", pWindowSettings);
        var windowWidth = window.screen.width / 1.3;
        var map2_ = false;
        if (dom.byId("map2") != null) {
            map2_ = true;
        }

        if (!map2_) {
            var featureInfo = dom.byId("featureInfo_frame").contentDocument.body.innerHTML;
            var featureInfo_label = query("label", dom.byId("featureInfo_frame").contentDocument.body)[0].innerHTML;
            var featureInfo_height = domStyle.get("featureInfo_frame", "height") + 10;
        } else {
            var featureInfo1 = dom.byId("featureInfo_frame1").contentDocument.body.innerHTML;
            var featureInfo2 = dom.byId("featureInfo_frame2").contentDocument.body.innerHTML;
            var featureInfo_label1 = null;
            var featureInfo_label2 = null;
            var featureInfo_height1 = domStyle.get("featureInfo_frame1", "height") + 10;
            var featureInfo_height2 = domStyle.get("featureInfo_frame2", "height") + 10;

            query("#feature_label", dom.byId("featureInfo_frame1").contentDocument.body).forEach(function(node){
            	featureInfo_label1 = query("div:first-of-type", node).forEach(function(node_){
                    return node_.innerHTML;
                })[0].innerHTML;
            });
            
            query("#feature_label", dom.byId("featureInfo_frame2").contentDocument.body).forEach(function(node){
            	featureInfo_label2 = query("div:first-of-type", node).forEach(function(node_){
                    return node_.innerHTML;
                })[0].innerHTML;
            });
        }

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
        domStyle.set(win.body(), "width", "99%");
        var bodyWidth = windowWidth*0.99;

        domConstruct.create("div", {
            id: "wrapper",
            style: {
                "position": "relative",
                "width": "90%",
                "marginLeft": "auto",
                "marginRight": "auto"
            }
        }, win.body());
        var wrapperWidth = bodyWidth * 0.90;

        domConstruct.create("section", {
            id: "headings",
            style: {
                "marginTop":" 10px"
            }
        }, "wrapper");

        domConstruct.create("h1", {
            innerHTML: "Name of this service: " + service_JSON.title[0],
            style: {
                fontFamiliy: "'Myriad Pro','Helvetica Neue',Helvetica,Arial,Sans-Serif",
                textShadow: "0px 1px 1px silver"
            }
        }, "headings");

        domConstruct.create("h3", {
            innerHTML: "Abstract of this service: " + service_JSON.abstractText[0],
            style: {
                fontFamiliy: "'Myriad Pro','Helvetica Neue',Helvetica,Arial,Sans-Serif",
                textShadow: "0px 1px 1px silver"
            }
        }, "headings");       

        /* get Map Image */       
        var mapImage = null;
        var bbox = "";
        var imageUrl = [];

        var map1Width = wrapperWidth * 0.70;



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

        domConstruct.create("section", {
            id: "MapAndLegend1",
            style: {
                "marginTop":" 10px"
            }
        }, "wrapper");

        domConstruct.create("div", {
            id: "map1",
            style: {
               "display":"inline-flex",
               "width":"70%",
               "height":"400px"
            }
        }, "MapAndLegend1");

        var map1Width = wrapperWidth * 0.70;

        domConstruct.create("div", {
            id: "legend1",
            style: {
               "display":" inline-block",
               "width":"20%",
               "height":"400px",
               "marginLeft":"10px"
            }
        }, "MapAndLegend1");
        var legend1Width = wrapperWidth * 0.20;

        /*create & display map and overlay image */
        var mapSurface = gfx.createSurface("map1", map1Width, 400);
        for (var i in imageUrl) {
            mapSurface.createImage({
                x: 0,
                y: 0,
                width: 650,//(map1Width / imageUrl[i].width) * imageUrl[i].width,
                height: (400 / imageUrl[i].height) * imageUrl[i].height,
                src: imageUrl[i].url
            });
        }
        /* if overlays are available...*/        
        map.getOverlays().forEach(function(overlay) {
            mapSurface.createImage({
                x: ((map1Width / map.getSize()[0]) * map.getPixelFromCoordinate(overlay.getProperties().position)[0]) - 21 / 2,
                y: ((400 / map.getSize()[1]) * map.getPixelFromCoordinate(overlay.getProperties().position)[1]) - 25,
                width: overlay.values_.element.width,
                height: overlay.values_.element.height,
                src: overlay.values_.element.src
            });
        });

        /* add legend image */       
        var legendSurface = gfx.createSurface("legend1", legend1Width, 400);
        if (legendImage.width > legend1Width) {
            legendSurface.createImage({
                x: 0,
                y: 0,
                width: (legend1Width / legendImage.width) * legendImage.width + "px",
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
            
            domConstruct.create("section", {
            id: "MapAndLegend2",
                style: {
                    "marginTop":" 1px"
                }
            }, "wrapper");

            domConstruct.create("div", {
                id: "map2",
                style: {
                   "display":"inline-flex",
                   "width":"70%",
                   "height":"400px"
                }
            }, "MapAndLegend2");
            var map2Width = wrapperWidth * 0.70;

            domConstruct.create("div", {
                id: "legend2",
                style: {
                   "display":" inline-block",
                   "width":"20%",
                   "height":"400px",
                   "marginLeft":"10px"
                }
            }, "MapAndLegend2");
            var legend2Width = wrapperWidth * 0.20;

            /*create & display map and overlay image */
            var mapSurface2 = gfx.createSurface("map2", map2Width, 400);
            for (var i in imageUrl2) {
                mapSurface2.createImage({
                    x: 0,
                    y: 0,
                    width: (map2Width / imageUrl2[i].width) * imageUrl2[i].width,
                    height: (400 / imageUrl2[i].height) * imageUrl2[i].height,
                    src: imageUrl2[i].url
                });
            }
            /* if overlays are available...*/           
            map2.getOverlays().forEach(function(overlay2) {
                mapSurface2.createImage({
                    x: ((map2Width / map2.getSize()[0]) * map2.getPixelFromCoordinate(overlay2.getProperties().position)[0]) - 21 / 2,
                    y: ((400 / map2.getSize()[1]) * map2.getPixelFromCoordinate(overlay2.getProperties().position)[1]) - 25,

                    width: overlay2.values_.element.width,
                    height: overlay2.values_.element.height,
                    src: overlay2.values_.element.src
                });
            });

            /* add legend image */
            
            var legendSurface2 = gfx.createSurface("legend2", legend2Width, 400);
            if (legendImage2.width > legend2Width) {
                legendSurface2.createImage({
                    x: 0,
                    y: 0,
                    width: (legend2Width / legendImage2.width) * legendImage2.width + "px",
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

        domConstruct.create("section", {
            id: "featureInfo",
            style: {
                "marginTop": "10px"
            }
        }, "wrapper");

        if (!map2_) {
            if (featureInfo_label != "Click on the map to get feature information.") {
                domConstruct.create("h3", {
                    id: "featureInfoLabel",
                    innerHTML: "Feature Information",
                    style: {

                    }
                }, "featureInfo");
 
                domConstruct.create("article", {
                    id: "fi1",
                    innerHTML: featureInfo,
                    style: {
                        "display": "inline-block",
                        "maxWidth": "99%"
                    }
                }, "featureInfo");
            }
        } else {
            if (featureInfo_label1 != "Click on the map to get feature information." && featureInfo_label2 != "Click on the map to get feature information.") {
                
                domConstruct.create("h3", {
                    id: "featureInfoLabel",
                    innerHTML: "Feature Information",
                    style: {

                    }
                }, "featureInfo");

                domConstruct.create("article", {
                    id: "fi1",
                    innerHTML: featureInfo1,
                    style: {
                        "display": "inline-block",
                        "maxWidth": "45%",
                        "marginRight": "4%"
                    }
                }, "featureInfo");

                domConstruct.create("article", {
                    id: "fi2",
                    innerHTML: featureInfo2,
                    style: {
                        "display": "inline-block",
                        "maxWidth": "45%"
                    }
                }, "featureInfo");
            }
        }

        domConstruct.create("section", {
            id: "BtnArea",
            style: {
                "marginTop": "10px"
            }
        }, "wrapper");

        domConstruct.create("input", {
            type: "button",
            value: "Print",
            style:{
                width: "100px",
                height: "25px",
                "marginLeft": "30px"
            },
            onclick: function() {
                pWindow.print();
            }
        }, "BtnArea");

        domConstruct.create("input", {
            type: "button",
            value: "Cancel",
            style:{
                width: "100px",
                height: "25px",
                "marginLeft": "30px"
            },
            onclick: function() {
                pWindow.close();
            }
        }, "BtnArea");
    });

}