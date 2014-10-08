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
 * This method adds tooltips to the buttons in the application.
 */
function buildToolTips() {
    var serviceData;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "serviceDescriptionParam",
        onItem: function(item, request) {
            serviceData = item;
        }
    });
    new dijit.Tooltip({
        connectId: ["description_wms_title"],
        label: '<div class="tooltip">Abstract of this service: ' + serviceData.abstractText + '</div>'
    });
    //openlayers
    new dijit.Tooltip({
        connectId: ["OpenLayers.Control.PanZoom_5_zoomworld_innerImage"],
        label: '<div class="tooltip">Click to zoom to full extent.</div>'
    });
    new dijit.Tooltip({
        connectId: ["OpenLayers.Control.PanZoom_5_zoomin_innerImage"],
        label: '<div class="tooltip">Click to zoom in.</div>'
    });
    new dijit.Tooltip({
        connectId: ["OpenLayers.Control.PanZoom_5_zoomout_innerImage"],
        label: '<div class="tooltip">Click to zoom out.</div>'
    });
    new dijit.Tooltip({
        connectId: ["OpenLayers.Control.PanZoom_5_panup_innerImage"],
        label: '<div class="tooltip">Click to pan north.</div>'
    });
    new dijit.Tooltip({
        connectId: ["OpenLayers.Control.PanZoom_5_pandown_innerImage"],
        label: '<div class="tooltip">Click to pan south.</div>'
    });
    new dijit.Tooltip({
        connectId: ["OpenLayers.Control.PanZoom_5_panleft_innerImage"],
        label: '<div class="tooltip">Click to pan west.</div>'
    });
    new dijit.Tooltip({
        connectId: ["OpenLayers.Control.PanZoom_5_panright_innerImage"],
        label: '<div class="tooltip">Click to pan east.</div>'
    });
    //time
    new dijit.Tooltip({
        connectId: ["time_start_label"],
        position: ['above'],
        label: '<div class="tooltip2">Begin of time period.</div>'
    });
    new dijit.Tooltip({
        connectId: ["time_end_label"],
        position: ['above'],
        label: '<div class="tooltip2">End of time period.</div>'
    });
    if (dojo.byId('play_button') != null) new dijit.Tooltip({
        connectId: ["play_button"],
        position: ['above'],
        label: '<div class="tooltip2">Click to start or stop animating the map.</div>'
    });
    if (dojo.byId('stateSelect') != null) new dijit.Tooltip({
        connectId: ["stateSelect"],
        position: ['above'],
        label: '<div class="tooltip" style="width:250px;">Choose the time step which should be visualized.</div>'
    });
    //feature info
    new dijit.Tooltip({
        connectId: ["featureInfo_frame"],
        position: ['above'],
        label: '<div class="tooltip style="width:250px;">This frame shows feature information for a choosen point on the map if the service provides feature information. Click on the map to choose a point of interest. <br><br> Feature information is only shown for the first visible layer.</div>'
    });
    //legend
    if (dojo.byId('legend_frame') != null)
        new dijit.Tooltip({
            connectId: ["legend_frame"],
            position: ['above'],
            label: '<div class="tooltip" style="width:250px;">This is the legend for the data provided by the service.</div>'
        });
}