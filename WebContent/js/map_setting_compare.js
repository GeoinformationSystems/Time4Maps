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
 * This javascript file contains source code for initalizing the OpenLayers map and legend.
 * The general params, such as wms name, layer name ... will be added to the gui element.
 * Time information is checked and appropriate methods to generate time slider or time combobox are called.
 *
 * @author Christin Henzen, Daniel Kadner, Hannes Tressel. Professorship of Geoinformation Systems
 */

var map, wms_layer;
var layer_Array;
var vis_layer_number = 0;
var map2, wms_layer2;
var layer_Array2;
var vis_layer_number2 = 0;

/**
 * This method will be called from index.jsp/start.jsp to initialize the content filling.
 */
function initializeMapping() {
    var b2 = new dijit.form.DateTextBox({
        value: "01-11-2006",
        name: "fromDate_Input",
        onChange: fromDateChanged
    }, "fromDate_Input");
    setMapValues();
}

/**
 * The method adds choosen layers to the map and register several events, e.g. change visible layer.
 * It also handles the connection between the two maps.
 */
function setMapValues() {

    var service_JSON2 = null;
    var layer_JSON2 = null;
    var time_JSON2 = null;

    wmsDescription_Store2.fetchItemByIdentity({
        identity: "serviceDescriptionParam",
        onItem: function(item, request) {
            service_JSON2 = item;
        }
    });
    wmsDescription_Store2.fetchItemByIdentity({
        identity: "layerDescriptionParam",
        onItem: function(item, request) {
            layer_JSON2 = item;
        }
    });
    wmsDescription_Store2.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON2 = item;
        }
    });

    map2 = new ol.Map({
        renderer: "canvas",
        target: "map2",
        layers: [
            new ol.layer.Tile({
                title: "vmap0",
                source: new ol.source.TileWMS({
                    url: 'http://vmap0.tiles.osgeo.org/wms/vmap0',
                    params: {
                        'VERSION': '1.1.1',
                        'LAYERS': 'basic',
                        'FORMAT': 'image/jpeg'
                    }
                })
            })
        ],
        view: new ol.View2D({
            center: transform(0, 0),
            zoom: 0,
            projection: "EPSG:4326"
        }),
        controls: [
            new ol.control.MousePosition({
                projection: "EPSG:4326"
            }),
            new ol.control.ZoomSlider()
        ]
    });

    layer_Array2 = new Array(layer_JSON2.name.length);
    for (var i = 0; i < layer_Array2.length; i++) {
        if (time_JSON2 != null && time_JSON2.def[i] != null && time_JSON2.start[i] != null) {
            if (service_JSON2.format === "image/tiff" || service_JSON2.format == "image/tiff") {
                wms_layer2 = new ol.layer.Image({
                    title: layer_JSON2.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON2.map, //service_JSON2.url,
                        params: {
                            "LAYERS": layer_JSON2.name[i],
                            "FORMAT": "image/png",
                            "VERSION": "1.1.1",
                            //"VERSION": service_JSON2.version[0],
                            "time": cutDate(new Date(time_JSON2.def[i]))
                        }
                    })
                });

                map2.addLayer(wms_layer2);
                layer_Array2[i] = wms_layer2;

            } else {
                wms_layer2 = new ol.layer.Image({
                    title: layer_JSON2.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON2.map, //service_JSON2.url,
                        params: {
                            "LAYERS": layer_JSON2.name[i],
                            "FORMAT": service_JSON2.format[0],
                            "VERSION": "1.1.1",
                            // "VERSION": service_JSON2.version[0],
                            "time": cutDate(new Date(time_JSON2.def[i]))
                        }
                    })
                });
                map2.addLayer(wms_layer2);
                layer_Array2[i] = wms_layer2;
            }
        } else {
            if (service_JSON2.format === "image/tiff") {
                wms_layer2 = new ol.layer.Image({
                    title: layer_JSON2.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON2.map, //service_JSON2.url,
                        params: {
                            "LAYERS": layer_JSON2.name[i],
                            "FORMAT": "image/png"
                        }
                    })
                });
                map2.addLayer(wms_layer2);
                layer_Array2[i] = wms_layer2;

            } else {
                wms_layer2 = new ol.layer.Image({
                    title: layer_JSON2.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON2.map, //service_JSON2.url,
                        params: {
                            "LAYERS": layer_JSON2.name[i],
                            "FORMAT": "image/png"
                        }
                    })
                });
                map2.addLayer(wms_layer2);
                layer_Array2[i] = wms_layer2;
            }
        }
        if (i < layer_Array2.length-1) wms_layer2.setVisible(false);
    }

    setLegendValues(0, 0);
    if (markers2 != null) {
        markers2 = null;
    }
 
    var service_JSON = null;
    var layer_JSON = null;
    var time_JSON = null;

    wmsDescription_Store.fetchItemByIdentity({
        identity: "serviceDescriptionParam",
        onItem: function(item, request) {
            service_JSON = item;
        }
    });
    wmsDescription_Store.fetchItemByIdentity({
        identity: "layerDescriptionParam",
        onItem: function(item, request) {
            layer_JSON = item;
        }
    });
    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });
  
    map = new ol.Map({
        renderer: "canvas",
        target: "map",
        layers: [
            new ol.layer.Tile({
                title: "vmap0",
                source: new ol.source.TileWMS({
                    url: 'http://vmap0.tiles.osgeo.org/wms/vmap0',
                    params: {
                        'VERSION': '1.1.1',
                        'LAYERS': 'basic',
                        'FORMAT': 'image/jpeg'
                    }
                })
            })
        ],
        view: new ol.View2D({
            center: transform(0, 0),
            zoom: 0,
            projection: "EPSG:4326"
        }),
        controls: [
            new ol.control.MousePosition({
                projection: "EPSG:4326"
            }),
            new ol.control.ZoomSlider()
        ]
    });

    layer_Array = new Array(layer_JSON.name.length);

    //parse all layers and decide whether there should be loaded time gui (slider, combobox) or not
    for (var i = 0; i < layer_Array.length; i++) {
        if (time_JSON != null && time_JSON.def[i] != null && time_JSON.start[i] != null) {
            if (service_JSON.format === "image/tiff" || service_JSON.format == "image/tiff") {
                wms_layer = new ol.layer.Image({
                    title: layer_JSON.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON.map, //service_JSON.url,
                        params: {
                            "LAYERS": layer_JSON.name[i],
                            "FORMAT": "image/png",
                            "VERSION": "1.1.1",
                            //"VERSION": service_JSON.version[0],
                            "time": cutDate(new Date(time_JSON.def[i]))
                        }
                    })
                });

                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer;

            } else {
                wms_layer = new ol.layer.Image({
                    title: layer_JSON.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON.map, //service_JSON.url,
                        params: {
                            "LAYERS": layer_JSON.name[i],
                            "FORMAT": service_JSON.format[0],
                            "VERSION": "1.1.1",
                            //"VERSION": service_JSON.version[0],
                            "time": cutDate(new Date(time_JSON.def[i]))
                        }
                    })
                });
                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer;
            }
        } else {
            if (service_JSON.format === "image/tiff") {
                wms_layer = new ol.layer.Image({
                    title: layer_JSON.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON.map, //service_JSON.url,
                        params: {
                            "LAYERS": layer_JSON.name[i],
                            "FORMAT": "image/png"
                        }
                    })
                });
                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer;

            } else {
                wms_layer = new ol.layer.Image({
                    title: layer_JSON.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON.map, //service_JSON.url,
                        params: {
                            "LAYERS": layer_JSON.name[i],
                            "FORMAT": "image/png"
                        }
                    })
                });
                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer;
            }
        }
        if (i < layer_Array.length-1) wms_layer.setVisible(false);
    }

    if (markers != null) {
        markers = null;
    }

    //map Events
    map.getView().on("change:resolution", function() {
        map2.setView(map.getView());
    });

    map2.getView().on("change:resolution", function() {
        map.setView(map2.getView());
    });

    map.getView().on("change:center", function() {
        map2.setView(map.getView());
    });

    map2.getView().on("change:center", function() {
        map.setView(map2.getView());
    });
 
}

var leg_1 = false;
var leg_2 = false;

/**
 * The method is called, if the visibility of a layer is changed.
 *
 * @param pos_Array - the position of the legend url in the array of all legends to all loaded layer
 */
function setLegendValues(pos_Array, mapno) {
    var legend_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "legendParam",
        onItem: function(item, request) {
            legend_JSON = item;
        }
    });
    if (legend_JSON.url === null || legend_JSON.url[pos_Array] === "null") {
        leg_1 = false;
    } else {
        leg_1 = true;
        if (mapno == 0 || mapno == 1) dojo.byId('legend_frame').src = legend_JSON.url[pos_Array] + "&height=" + legend_JSON.height[pos_Array] + "&width=" + legend_JSON.width[pos_Array];
        if (mapno == 1) dojo.byId('description_wms_title').innerHTML = layer_Array[pos_Array].name;
    }
    var legend_JSON2;
    wmsDescription_Store2.fetchItemByIdentity({
        identity: "legendParam",
        onItem: function(item, request) {
            legend_JSON2 = item;
        }
    });

    if (legend_JSON2.url === null || legend_JSON2.url[pos_Array] === "null") {
        leg_2 = false;
    } else {
        leg_2 = true;
        if (mapno == 0 || mapno == 2) dojo.byId('legend_frame2').src = legend_JSON2.url[pos_Array] + "&height=" + legend_JSON2.height[pos_Array] + "&width=" + legend_JSON2.width[pos_Array];
        if (mapno == 2) dojo.byId('description_wms_title2').innerHTML = layer_Array2[pos_Array].name;
    }
    showLegend();
    hideLegend();
}

/**
 * This method hides the image frames for the legends.
 */
function hideLegend() {
    if (leg_1 == false) dojo.byId('legend_frame').style.visibility = 'hidden';
    if (leg_2 == false) dojo.byId('legend_frame2').style.visibility = 'hidden';
}

/**
 * This method shows the image frames for the legends.
 */
function showLegend() {
    if (leg_1 == true) dojo.byId('legend_frame').style.visibility = 'visible';
    if (leg_2 == true) dojo.byId('legend_frame2').style.visibility = 'visible';
}

/**
 * This method adapts time information of OpenLayers layer params to change the maps based on new chosen time stamp.
 *
 * @param date_JSDate - the time stamp choosen by the user
 */
function setMapTime(date_JSDate) {
    for (var i = 0; i < layer_Array.length; i++) {
        if (combo == false) {
            layer_Array[i].getSource().updateParams({
                'time': cutDate(date_JSDate)
            });
            layer_Array2[i].getSource().updateParams({
                'time': cutDate(date_JSDate)
            });
        } else {
            layer_Array[i].getSource().updateParams({
                'time': date_JSDate
            });
            layer_Array2[i].getSource().updateParams({
                'time': cutDate(date_JSDate)
            });
        }
    }
}

function transform(lon, lat) {
    return ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
}