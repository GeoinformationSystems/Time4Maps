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
	if (map.getLayers().array_.length > 2) {
		
		dojo.byId("layerSwitcherCustom").style.width = "300px";
	    dojo.byId("layerSwitcherCustom").style.height = "200px";
	    
	    require(["dojo/dom-construct", "dijit/form/HorizontalSlider", "dojo/dom-attr", "dojo/dom", "dijit/registry", "dojo/dom-style", "dojo/_base/fx"], function(domConstruct, HzSlider, domAttr, dom, registry, domStyle, fx) {
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
	
	            if (layer instanceof ol.layer.Image) {
	                domConstruct.destroy(layer.getProperties().title + "_checkbox");
	                domConstruct.place(domConstruct.create("div", {
	                    id: layer.getProperties().title + "_area",
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
	                    id: layer.getProperties().title,
	                    innerHTML: layer.getProperties().title,
	                    style: {
	                        display: "block",
	                        width: "90%",
	                        marginTop: "0px",
	                        font: "bold 11px sans-serif",
	                        color: "#333"
	                    }
	                }, layer.getProperties().title + "_area");
	
	                domConstruct.create("input", {
	                    id: layer.getProperties().title + "_checkbox",
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
	                }, layer.getProperties().title + "_area");
	
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
	                }, layer.getProperties().title + "_area");
	
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
	                }, layer.getProperties().title + "_area");
	
	                domConstruct.create("div", {
	                    id: layer.getProperties().title + "_slider"
	                }, layer.getProperties().title + "_area");
	
	                if (registry.byId(layer.getProperties().title + "_slider") != undefined) {
	                    registry.byId(layer.getProperties().title + "_slider").destroyRecursive();
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
	
	                }, layer.getProperties().title + "_slider");
	            }
	
	        });
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
            if (dom.byId(map.getLayers().array_[i].getProperties().title + "_checkbox").checked) {
                setLegendValues(i - 1);
                vis_layer_number = i - 1;
                break;
            }
        }
    });
}

function updateFeatureInfo() {
	if (last_event != null) { 
        var source = featureInfoUrl; 
        var layer_JSON;
        wmsDescription_Store.fetchItemByIdentity({
            identity: "layerDescriptionParam",
            onItem: function(item, request) { layer_JSON = item; }
        });
        
        
        if (typeof source != null) {
            require(["dojo/dom-attr", "dojo/io-query"], function(domAttr, ioQuery) {
                var sourceObject = ioQuery.queryToObject(source);
                var url = "featureInfo_compare.jsp?url=" + service_url + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + layer_JSON.name[vis_layer_number] + "&crs=" + sourceObject.SRS + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + sourceObject.X + "&J=" + sourceObject.Y + "&time=" + cutDate(dijit.byId('time_slider').get('value'));
                domAttr.set("featureInfo_frame", "src", url);
            });
        }
    }
}