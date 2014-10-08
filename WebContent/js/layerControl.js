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
 * This class creates a new layer chooser widget.
 *
 * @author Hannes Tressel. Professorship of Geoinformation Systems
 */
function initLayerControlWidget() {
    var checkedAll = false;
    if (map.getLayers().array_.length > 2) {

        dojo.byId("layerSwitcherCustom").style.width = "300px";
        dojo.byId("layerSwitcherCustom").style.height = "200px";

        require(["dojo/dom-construct", "dijit/form/HorizontalSlider", "dojo/dom-attr", "dojo/dom", "dijit/registry", "dojo/dom-style", "dojo/_base/fx", "dojo/query"], function(domConstruct, HzSlider, domAttr, dom, registry, domStyle, fx, query) {
            domConstruct.create("div", {
                id: "layerControlStatusBtn",
                style: {
                    display: "block",
                    position: "absolute",
                    width: "16px",
                    height: "16px",
                    top: "0px",
                    right: "40px",
                    background: "url('images/icons/layerswitcher/minimize_window.png') no-repeat",
                    backgroundSize: "16px 16px",
                    zIndex: 10000
                },
                onclick: function() {
                    if (domStyle.get("layerSwitcherCustom", "height") > 0) {
                        fx.animateProperty({
                            node: dom.byId("layerSwitcherCustom"),
                            properties: {
                                height: 0
                            },
                            duration: 600
                        }).play();


                        domStyle.set("layerControlStatusBtn", "background", "url('images/icons/layerswitcher/maximize_window.png') no-repeat");
                        domStyle.set("layerControlStatusBtn", "backgroundSize", "16px 16px");
                    } else {
                        fx.animateProperty({
                            node: dom.byId("layerSwitcherCustom"),
                            properties: {
                                height: 200
                            },
                            duration: 600
                        }).play();

                        domStyle.set("layerControlStatusBtn", "background", "url('images/icons/layerswitcher/minimize_window.png') no-repeat");
                        domStyle.set("layerControlStatusBtn", "backgroundSize", "16px 16px");
                    }
                }
            }, "map");

            map.getLayers().forEach(function(layer, index) {
                var layerName = layer.getSource().getParams().LAYERS;

                if (layer instanceof ol.layer.Image) {
                    domConstruct.destroy(layerName + "_checkbox");
                    domConstruct.place(domConstruct.create("div", {
                        id: layerName + "_area",
                        style: {
                            display: "block",
                            position: "relative",
                            top: "20px",
                            left: "30px",
                            width: "90%",
                            marginBottom: "10px"
                        }
                    }), "layerSwitcherCustom", "first");

                    domConstruct.create("div", {
                        id: layerName,
                        innerHTML: layer.getProperties().title,
                        style: {
                            display: "block",
                            width: "90%",
                            marginTop: "0px",
                            font: "bold 11px sans-serif",
                            color: "#333"
                        }
                    }, layerName + "_area");

                    domConstruct.create("input", {
                        id: layerName + "_checkbox",
                        type: "checkbox",
                        name: "visibility",
                        checked: layer.getVisible(),
                        index_: index,
                        style: {
                            position: "relative",
                            top: "5px",
                            marginTop: "1px",
                            marginLeft: "0px"
                        },
                        onclick: function() {
                            if (this.checked) {
                                layer.setVisible(true);
                            } else {
                                layer.setVisible(false);
                            }

                            //always call updateLegend() first - it resets var vis_layer_numbers, that is used in updateTimeValues()
                            updateLegend(); //change layer legend 
                            updateTimeValues();
                            updateFeatureInfo();
                        }
                    }, layerName + "_area");

                    domConstruct.create("img", {
                        src: "images/icons/layerswitcher/moveup.png",
                        style: {
                            position: "relative",
                            top: "5px",
                            left: "4px"
                        },
                        onclick: function() {
                            map.getLayers().removeAt(index);
                            map.getLayers().insertAt(index + 1, layer);
                            updateLayerControlWidget();
                        }
                    }, layerName + "_area");

                    domConstruct.create("img", {
                        src: "images/icons/layerswitcher/movedown.png",
                        style: {
                            position: "relative",
                            top: "5px",
                            left: "15px"
                        },
                        onclick: function() {
                            map.getLayers().removeAt(index);
                            map.getLayers().insertAt(index - 1, layer);
                            updateLayerControlWidget();
                        }
                    }, layerName + "_area");

                    domConstruct.create("div", {
                        id: layerName + "_slider"
                    }, layerName + "_area");

                    if (registry.byId(layerName + "_slider") != undefined) {
                        registry.byId(layerName + "_slider").destroyRecursive();
                    }

                    new HzSlider({
                        minimum: 0,
                        maximum: 10,
                        value: 10,
                        intermediateChanges: true,
                        style: {
                            "position": "relative",
                            "top": "-11px",
                            "left": "50px",
                            "width": "110px"
                        },
                        onChange: function(value) {
                            layer.setOpacity(value / 10);
                        }

                    }, layerName + "_slider");
                }

            });

            domConstruct.create("input", {
                type: "button",
                value: "Select All/None",
                style: {
                    position: "relative",
                    bottom: "-22px",
                    left: "27px"
                },
                onclick: function() {
                    query("input[type='checkbox']").forEach(function(widget) {
                        (!checkedAll) ? (widget.checked = true) : (widget.checked = false);
                    });

                    if (checkedAll) {
                        map.getLayers().forEach(function(layer) {
                            if (layer instanceof ol.layer.Image) {
                                layer.setVisible(false);
                            }
                        });
                        checkedAll = false
                    } else {
                        map.getLayers().forEach(function(layer) {
                            (layer instanceof ol.layer.Image) ? (layer.setVisible(true)) : (layer.setVisible(true));
                        });
                        checkedAll = true
                    }

                    updateLegend();
                    updateTimeValues();
                    updateFeatureInfo();
                }

            }, "layerSwitcherCustom");

        });
    }
}

function updateLayerControlWidget() {
    require(["dojo/dom-construct", "dojo/query"], function(domConstruct, query) {
        query("#layerSwitcherCustom *").forEach(function(node) {
            domConstruct.destroy(node);
        });
        initLayerControlWidget();
        //always call updateLegend() first - it resets var vis_layer_numbers, that is used in updateTimeValues()
        updateLegend();
        updateTimeValues();
        updateFeatureInfo();
    });
}

function updateLegend() {
    require(["dojo/dom", "dojo/query"], function(dom, query) {
        for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
            var layerName = map.getLayers().array_[i].getSource().getParams().LAYERS;
            if (dom.byId(layerName + "_checkbox").checked) {
                setLegendValues(i - 1);
                vis_layer_number = i - 1;
                break;
            }
        }
    });
}

function updateFeatureInfo() {
    require(["dojo/dom-attr", "dojo/io-query", "dijit/registry", "dojo/dom", "dojo/query"], function(domAttr, ioQuery, registry, dom, query) {
        if (last_event != null) {
            var layer_JSON;
            wmsDescription_Store.fetchItemByIdentity({
                identity: "layerDescriptionParam",
                onItem: function(item, request) {
                    layer_JSON = item;
                }
            });

            var layer = null;
            var visible = false;
            for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
                layer = map.getLayers().array_[i];
                if (layer.getVisible()) {
                    visible = true;
                    var source = featureInfoUrl;
                    if (typeof source != null) {
                        var sourceObject = ioQuery.queryToObject(source);
                        var url = null;
                        if (registry.byId('time_slider') != null) {
                            url = "featureInfo_compare.jsp?url=" + service_url +
                                "&request=GetFeatureInfo&service=WMS" +
                                "&version=" + sourceObject.VERSION +
                                "&query_layers=" + layer.getSource().getParams().LAYERS +
                                "&crs=" + ((sourceObject.VERSION === "1.1.1") ? (sourceObject.SRS) : (sourceObject.CRS)) +
                                "&bbox=" + sourceObject.BBOX +
                                "&width=" + sourceObject.WIDTH +
                                "&height=" + sourceObject.HEIGHT +
                                "&I=" + ((sourceObject.VERSION === "1.1.1") ? (sourceObject.X) : (sourceObject.I)) +
                                "&J=" + ((sourceObject.VERSION === "1.1.1") ? (sourceObject.Y) : (sourceObject.J)) +
                                "&time=" + cutDate(dijit.byId('time_slider').get('value'));

                        } else if (registry.byId('stateSelect') != null) {
                            url = "featureInfo_compare.jsp?url=" + service_url +
                                "&request=GetFeatureInfo&service=WMS" +
                                "&version=" + sourceObject.VERSION +
                                "&query_layers=" + layer.getSource().getParams().LAYERS +
                                "&crs=" + ((sourceObject.VERSION === "1.1.1") ? (sourceObject.SRS) : (sourceObject.CRS)) +
                                "&bbox=" + sourceObject.BBOX +
                                "&width=" + sourceObject.WIDTH +
                                "&height=" + sourceObject.HEIGHT +
                                "&I=" + ((sourceObject.VERSION === "1.1.1") ? (sourceObject.X) : (sourceObject.I)) +
                                "&J=" + ((sourceObject.VERSION === "1.1.1") ? (sourceObject.Y) : (sourceObject.J)) +
                                "&time=" + cutDate(dijit.byId('stateSelect').get('value'));
                        }
                        if (url != null) {
                            domAttr.set("featureInfo_frame", "src", url);
                        }

                    }
                    break;
                }
            }

            //get FeatureInfoURI
            if (!visible) {
                //Click on the map to get feature information.
                var featureInfo = dom.byId("featureInfo_frame").contentDocument.body.innerHTML;
                query("label", dom.byId("featureInfo_frame").contentDocument.body)[0].innerHTML = "Click on the map to get feature information.";
                //remove Overlays && Click-Position
                map.getOverlays().forEach(function(overlay) {
                    map.removeOverlay(overlay);
                });
                last_event = null;
                source = null;
            }
        }
    });
}
