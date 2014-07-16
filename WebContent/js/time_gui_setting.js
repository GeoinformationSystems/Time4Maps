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
 * This class is used to initialize time gui.
 * Based on the given time steps or time stamps a combobox or calendar is initialized.
 * It is only used for the time4maps view.
 *
 * @author Hannes Tressel, Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */
var combo = false;
var hasTimeData = false;

/**
 * This method initializes the time gui filling process.
 */
function initializeTimeGuiFilling() {
	var period_JSON, time_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {
            period_JSON = item;
        }
    });
     
    //showing either date picker combobox with calender or time picker
    
    //date picker with calendar
    if (period_JSON.hour[vis_layer_number] <= 0 && period_JSON.minute[vis_layer_number] <= 0 && period_JSON.second[vis_layer_number] <= 0) {
    	dojo.declare("enDateTextBox", dijit.form.DateTextBox, {
            enFormat: {
                selector: 'date',
                datePattern: 'yyyy-MM-dd',
                locale: 'en-gb'
            },
            value: "",
            postMixInProperties: function() {
                this.inherited(arguments);
                this.value = dojo.date.locale.parse(this.value, this.enFormat);
            },
            serialize: function(dateObject, options) {
                return dojo.date.locale.format(dateObject, this.enFormat);
            }
        });
    	
    	var b2 = new enDateTextBox({
 	        value: "01-11-2006",
 	        name: "fromDate_Input",
 	        onChange: fromDateChanged
 	    }, "fromDate_Input");
    	
    //time picker without calendar widget
    } else {
    	dojo.declare("enDateTextBox", dijit.form.TimeTextBox, {
            enFormat: {
                selector: 'date',
                datePattern: 'yyyy-MM-dd hh:mm:sss',
                locale: 'en-gb'
            },
            value: "",
            postMixInProperties: function() {
                this.inherited(arguments);
                this.value = dojo.date.locale.parse(this.value, this.enFormat);
            },
            serialize: function(dateObject, options) {
                return dojo.date.locale.format(dateObject, this.enFormat);
            }
        });
    	
    	var minMaxT = getMinMaxT();
    	
	    var b2 = new enDateTextBox({
	    	constraints: {
	            timePattern: 'HH:mm:ss',
	            min: minMaxT[0], //'Thh:mm:ss',
	            max: minMaxT[1], //'Thh:mm:ss',
//	            clickableIncrement: 'T00:30:00', 	//define clickable stamps; always starts from 00:00
//	            visibleIncrement: 'T00:30:00', 		//define visualized stamps; always starts from 00:00
	            visibleRange: 'T01:00:00'
	        }, 
	        name: "fromDate_Input",
	        onChange: fromDateChanged
	    }, "fromDate_Input");
    }
    
    setTimeValues();
}

/**
 * This method handles updates on time information.
 */
function updateTimeValues() {
    var time_JSON, period_JSON;

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

    if (time_JSON.start[vis_layer_number] != null && time_JSON.end[vis_layer_number] != null && time_JSON.def[vis_layer_number] != null) {
        if (period_JSON.second[vis_layer_number] != null && period_JSON.minute[vis_layer_number] != null && period_JSON.hour[vis_layer_number] != null &&
        period_JSON.day[vis_layer_number] != null && period_JSON.month[vis_layer_number] != null && period_JSON.year[vis_layer_number] != null) {
            if (hasTimeData === false) {
                showTimeGui();
                if (dijit.byId('time_slider') === undefined)
                    buildSlider();
            }

            hasTimeData = true;
            combo = false;
            setSliderValues();
            setSliderLabelValues();
            setDatePickerValues(); 
            bindFeatureControls("time");
 
            if (dojo.byId('stateSelect'))
                dojo.byId('stateSelect').parentNode.removeChild(dojo.byId('stateSelect'));
        } else {
            if (hasTimeData === false) {
                showTimeGui();
                if (dijit.byId('stateSelect') === undefined)
                    buildCombo();
            }
            hasTimeData = true;
            combo = true;
            hidePartTimeGui();
            setSliderLabelValues();
            bindFeatureControls("time");
        } 
    } else {
        hasTimeData = false;
        hideTimeGui();
        bindFeatureControls("");
    }
}

/**
 * This method is used to initialize the time gui. It checks wether time information are available or not and calls the appropriate functions to initialize combobox or time slider.
 * A combobox will be displayed, if several single time steps are parsed from the wms capabilities.
 * A time slider will be displayed, if a start date, end date and time period is given.
 *
 * @param item - the time object of the wms store
 * @param request
 */
function setTimeValues() {
    var time_JSON, period_JSON;
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

    if (time_JSON.start[vis_layer_number] != null && time_JSON.end[vis_layer_number] != null && time_JSON.def[vis_layer_number] != null) {
        if (period_JSON.day[vis_layer_number] != null && period_JSON.month[vis_layer_number] != null && period_JSON.year[vis_layer_number] != null) {
            hasTimeData = true;
            combo = false;
            buildSlider();
            setSliderValues();
            setSliderLabelValues();
            setDatePickerValues();
            bindFeatureControls("time");
            dojo.byId('stateSelect').parentNode.removeChild(dojo.byId('stateSelect')); // löscht stateSelect
        } else {
            hasTimeData = true;
            combo = true;
            buildCombo();
            hidePartTimeGui();
            setSliderLabelValues();
            bindFeatureControls("time");
        }

    } else {
        hasTimeData = false;
        hideTimeGui();
        bindFeatureControls("");
    }
}

/**
 * This method intitializes the time slider. Values parsed from the wms capabilities document are used to set these slider params.
 *
 * @param item - the time object in the json store
 */
function setSliderValues() {
    var time_JSON, period_JSON;

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

    dijit.byId('time_slider').set("minimum", time_JSON.start[vis_layer_number]);
    dijit.byId('time_slider').set("maximum", time_JSON.end[vis_layer_number]);
    dijit.byId('time_slider').set("value", time_JSON.def[vis_layer_number]);

    if (period_JSON.second[vis_layer_number] > 0) {
        var diffSecs_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), new Date(time_JSON.end[vis_layer_number]), 'second');
        dijit.byId('time_slider').set("discreteValues", diffSecs_Int);
    }
    
    if (period_JSON.minute[vis_layer_number] > 0) {
    	var diffMins_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), new Date(time_JSON.end[vis_layer_number]), 'minute');
        dijit.byId('time_slider').set("discreteValues", diffMins_Int);
    }
    
    if (period_JSON.hour[vis_layer_number] > 0) {
        var diffHours_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), new Date(time_JSON.end[vis_layer_number]), 'hour');
        dijit.byId('time_slider').set("discreteValues", diffHours_Int);
    }
    
    if (period_JSON.day[vis_layer_number] > 0) {
        var diffDays_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), new Date(time_JSON.end[vis_layer_number]), 'day');
        dijit.byId('time_slider').set("discreteValues", diffDays_Int); 
    }

    if (period_JSON.month[vis_layer_number] > 0) {
        var diffMonths_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), new Date(time_JSON.end[vis_layer_number]), 'month');
        dijit.byId('time_slider').set("discreteValues", diffMonths_Int); 
    }

    if (period_JSON.year[vis_layer_number] > 0) {
        var diffYears_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), new Date(time_JSON.end[vis_layer_number]), 'year');
        dijit.byId('time_slider').set("discreteValues", diffYears_Int);
        dijit.byId('time_slider').set("showButtons", true);
    }
}

/**
 * This method sets the labels of the slider.
 *
 * @param item - the time object of the wms store
 */
function setSliderLabelValues() {
    var time_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {  time_JSON = item; }
    });
    
    var period_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {  period_JSON = item; }
    });

    var start_JSDate = new Date(time_JSON.start[vis_layer_number]);
    var start_DojoDate = dojo.date.locale.format(start_JSDate, {
        locale: "de-de",
        datePattern: "dd.MM.yyyy",
        selector: "date"
    });
    dojo.byId('time_start_label').innerHTML = start_DojoDate;

    var end_JSDate = new Date(time_JSON.end[vis_layer_number]);
    var end_DojoDate = dojo.date.locale.format(end_JSDate, {
        locale: "de-de",
        datePattern: "dd.MM.yyyy",
        selector: "date"
    });
    dojo.byId('time_end_label').innerHTML = end_DojoDate;
    
    var period = "period: ";
    if (period_JSON.second[vis_layer_number] > 0) period += period_JSON.second[vis_layer_number] + " sec ";
    if (period_JSON.minute[vis_layer_number] > 0) period += period_JSON.minute[vis_layer_number] + " min ";
    if (period_JSON.hour[vis_layer_number] > 0) period += period_JSON.hour[vis_layer_number] + " h ";
    if (period_JSON.day[vis_layer_number] > 0) period += period_JSON.day[vis_layer_number] + " d ";
    if (period_JSON.month[vis_layer_number] > 0) period += period_JSON.month[vis_layer_number] + " mo ";
    if (period_JSON.year[vis_layer_number] > 0) period += period_JSON.year[vis_layer_number] + " y ";
    
    if (dojo.byId('time_period_label') != null) dojo.byId('time_period_label').innerHTML = period;    
}

/**
 * This method sets the calendar value.
 *
 * @param item - the time object of the wms store
 */
function setDatePickerValues() {
    var time_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });

    var default_JSDate = new Date(time_JSON.start[vis_layer_number]);
    dijit.byId('fromDate_Input').set("value", default_JSDate);
    var default_DojoDate = dojo.date.locale.format(default_JSDate, {
        datePattern: "dd.MM.yyyy",
        selector: "month"
    });
    setMapTime(default_DojoDate);

}

/**
 * The method hide time gui, if it is not used.
 */
function hideTimeGui() {
    if (dojo.byId('time') != null)
        dojo.byId('time').style.visibility = 'hidden';
}
/**
 * The method shows time gui.
 */
function showTimeGui() {
    dojo.byId('time').style.visibility = 'visible';
}
/**
 * This method set time slider and play button invisible. Only combobox will be displayed.
 */
function hidePartTimeGui() {
    if (dojo.byId('widget_fromDate_Input'))
        dojo.byId('widget_fromDate_Input').style.visibility = 'hidden';
    dojo.byId('play').style.visibility = 'hidden';
    dojo.byId('stateSelect').style.visibility = "visible";
}

/**
 *
 */
function switchTimeView() {
    if (dojo.byId('description_time_table').style.visibility == "collapse") {
        dojo.byId('description_time_table').style.visibility = "visible";
    } else {
        dojo.byId('description_time_table').style.visibility = "collapse";
    }
}

function getMinMaxT() {
	var time_JSON;
	wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });
	var minT = "T", stDate = new Date(time_JSON.start[vis_layer_number]);
	if (stDate.getHours() < 10) minT += "0" + stDate.getHours() + ":";
	else minT += stDate.getHours() + ":";
	
	if (stDate.getMinutes() < 10) minT += "0" + stDate.getMinutes() + ":";
	else minT += stDate.getMinutes() + ":";
		
	if (stDate.getSeconds() < 10) minT += "0" + stDate.getSeconds();
	else minT += stDate.getSeconds();
	
	var maxT = "T", enDate = new Date(time_JSON.end[vis_layer_number]);
	if (enDate.getHours() < 10) maxT += "0" + enDate.getHours() + ":";
	else maxT += enDate.getHours() + ":";
	
	if (enDate.getMinutes() < 10) maxT += "0" + enDate.getMinutes() + ":";
	else maxT += enDate.getMinutes() + ":";
	
	if (enDate.getSeconds() < 10) maxT += "0" + enDate.getSeconds();
	else maxT += enDate.getSeconds();
	
	var minMaxT = [2];
	minMaxT[0] = minT;
	minMaxT[1] = maxT;
	
	return minMaxT; 
}