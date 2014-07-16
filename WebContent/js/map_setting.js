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
 * @author Hannes Tressel, Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */

//OL map, list of available layer
var map, wms_layer, layer_Array;
//number of actually visible layer
var vis_layer_number = 0;

/**
 * This method will be called from index.jsp/start.jsp to initialize the content filling.
 * Choosen layer are added to the map and click events on the map are registered here.
 */
function initializeMapping() {
    //getting objects from the json store

    var service_JSON = null;
    var layer_JSON = null;
    var time_JSON = null;
    var period_JSON = null;

    wmsDescription_Store.fetchItemByIdentity({
        identity: "layerDescriptionParam",
        onItem: function(item, request) {
            layer_JSON = item;
        }
    });

    wmsDescription_Store.fetchItemByIdentity({
        identity: "serviceDescriptionParam",
        onItem: function(item, request) {
            service_JSON = item;
        }
    });

    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });

    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {
            period_JSON = item;
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

    vis_layer_number = layer_JSON.name.length - 1;
    layer_Array = new Array(layer_JSON.name.length);

    //parse all layers and decide whether there should be loaded time gui (slider, combobox) or not
    for (var i = 0; i < layer_Array.length; i++) {
        if (time_JSON != null && time_JSON.def[i] != null && time_JSON.start[i] != null && period_JSON.year[i] != null && period_JSON.month[i] != null && period_JSON.day[i] != null) {
            if (service_JSON.format === "image/tiff" || service_JSON.format == "image/tiff") {
                wms_layer = new ol.layer.Image({
                    title: layer_JSON.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON.url,
                        params: {
                            "LAYERS": layer_JSON.name[i],
                            "FORMAT": "image/png",
                            "VERSION": service_JSON.version[0],
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
                        url: service_JSON.url,
                        params: {
                            "LAYERS": layer_JSON.name[i],
                            "FORMAT": service_JSON.format[0],
                            "VERSION": service_JSON.version[0],
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
                        url: service_JSON.url,
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
                        url: service_JSON.url,
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
    }

    //initialize map params
    setLegendValues(layer_Array.length - 1); 
    if (markers != null) {
        markers = null;
    }

    initLayerControlWidget();
}

/**
 * The method is called, if the visibility of a layer is changed.
 *
 * @param pos_Array - the position of the legend url in the array of all legends to all loaded layer
 */
function setLegendValues(pos_Array) {
    var legend_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "legendParam",
        onItem: function(item, request) {
            legend_JSON = item;
        }
    });
 
    if (legend_JSON.url === null || legend_JSON.url == "" || legend_JSON.url === undefined || legend_JSON.url[pos_Array] === "null" || legend_JSON.url[pos_Array] === null || legend_JSON.url[pos_Array] === undefined) {
        hideLegend();
    } else {

        //get height, width for the legend image
        if (legend_JSON.width[pos_Array] > 170) {
            var map_width_string = dojo.byId('map').style.width.substring(0, dojo.byId('map').style.width.length - 2);
            var total_width_int = parseInt(map_width_string) + parseInt(legend_JSON.width[pos_Array]) + parseInt(50);
            var width_string = total_width_int + 'px';
        }

        //set visibility for legend image
        showLegend();
 
        dojo.byId('legend_frame').src = legend_JSON.url[pos_Array] + "&height=" + legend_JSON.height[pos_Array] + "&width=" + legend_JSON.width[pos_Array];
    }
}

/**
 * This method hides the image frame for the legend.
 */
function hideLegend() {
    dojo.byId('legend_frame').style.visibility = 'hidden';
}

/**
 * This method shows the image frame for the legend.
 */
function showLegend() {
    dojo.byId('legend_frame').style.visibility = 'visible';
}

/**
 * This method adapts time information of OpenLayers layer param to change the map based on new chosen time stamp.
 *
 * @param date_JSDate - the time stamp choosen by the user
 */
var lastDate;

function setMapTime(date_JSDate) {
	for (var i = 0; i < layer_Array.length; i++) {
        if (combo == false) {
            var newD = cutDate(date_JSDate);
            if (newD != "0NaN-NaN" && newD != "0NaN") { 
                layer_Array[i].getSource().updateParams({
                    'time': newD
                });
                lastDate = newD;
            } else { 
                newD = cutDate(lastDate);
                layer_Array[i].getSource().updateParams({
                    'time': newD
                }); 
            }
        } else {
        	
        	if (date_JSDate.indexOf("+02:00") > 0) { 
        		date_JSDate = date_JSDate.replace(/\+02:00/g, "0Z");
        	}
        	
            layer_Array[i].getSource().updateParams({
                'time': date_JSDate
            });
        }
    }
}

function updateServicesLayersConfigUserClick(layer) {
    layer.visibilityUser = layer.visibility;
}

function transform(lon, lat) {
    return ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
}