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
 * This class is used to correct the dates that are chosen by the user.
 * If the user selects a date in the calendar that is not available.
 *
 * @author Christin Henzen, Hannes Tressel. Professorship of Geoinformation Systems
 */

var last_event;

function buildSlider() {
	var period_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {
            period_JSON = item;
        }
    });
    
    if (period_JSON.hour[vis_layer_number] <= 0 && period_JSON.minute[vis_layer_number] <= 0 && period_JSON.second[vis_layer_number] <= 0) {  
	    var time_slider = new dijit.form.HorizontalSlider({
	        name: "time_slider",
	        intermediateChanges: false,
	        clickSelect: true,
	        disabled: false, 
	        style: "width:800px;",
	        showButtons: true, //increment/decrement buttons (in)visible 
	        onChange: function(value) { 
	            var start_JSDate = new Date(value);
	            correctDate(start_JSDate, 0); //function is called when date picker is changed                
	        }
	    }, "time_slider"); //id for using the slider   
    } else {
    	var time_slider = new dijit.form.HorizontalSlider({
	        name: "time_slider",
	        intermediateChanges: false,
	        clickSelect: true,
	        disabled: false, 
	        style: "width:800px;",
	        showButtons: false, //increment/decrement buttons (in)visible 
	        onChange: function(value) { 
	            var start_JSDate = new Date(value);
	            correctDate(start_JSDate, 0); //function is called when date picker is changed                
	        }
	    }, "time_slider"); //id for using the slider   
    }
}
var lastDate;

function fromDateChanged(newFrom_DojoDate) { //fired when from date is set 
    if (newFrom_DojoDate != null && newFrom_DojoDate != "0NaN-NaN") { 
    	
    	var period_JSON; var time_JSON;
        wmsDescription_Store.fetchItemByIdentity({
            identity: "periodParam", onItem: function(item, request) {  period_JSON = item;  }
        });
        wmsDescription_Store.fetchItemByIdentity({
            identity: "timeParam",  onItem: function(item, request) { time_JSON = item; }
        });
        
        //setting time value to 0, when time (hours, minutes, seconds) information is not used 
        if (period_JSON.hour[vis_layer_number] > 0 || period_JSON.minute[vis_layer_number] > 0 || period_JSON.second[vis_layer_number] || 0) {
        	var startDate = new Date(time_JSON.start[vis_layer_number]);
        	 
        	newFrom_DojoDate.setDate(startDate.getDay() + 1);
        	newFrom_DojoDate.setMonth(startDate.getMonth());
        	newFrom_DojoDate.setFullYear(startDate.getFullYear());
        } 
 
        lastDate = newFrom_DojoDate;
        var newFrom_JSDate = new Date(newFrom_DojoDate);
        
        dijit.byId('time_slider').set("value", correctDate(newFrom_JSDate, 0).getTime());
        setMapTime(newFrom_JSDate);
        if (last_event != null) { 
            var source = featureInfoUrl;
            if (typeof source != null) {
                require(["dojo/dom-attr", "dojo/io-query"], function(domAttr, ioQuery) {
                    var sourceObject = ioQuery.queryToObject(source);
                    var url = "featureInfo_compare.jsp?url=" + service_url + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + sourceObject.SRS + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + sourceObject.X + "&J=" + sourceObject.Y + "&time=" + cutDate(dijit.byId('time_slider').get('value'));
                    domAttr.set("featureInfo_frame", "src", url);
                });
            }
        }
    } else if (lastDate != null && lastDate != "0NaN-NaN") {
        newFrom_DojoDate = lastDate;

        var newFrom_JSDate = new Date(newFrom_DojoDate);

        dijit.byId('time_slider').set("value", correctDate(newFrom_JSDate, 0).getTime());
        setMapTime(newFrom_JSDate);

        if (last_event != null) { 
            var source = featureInfoUrl;
            if (typeof source != null) {
                require(["dojo/dom-attr", "dojo/io-query"], function(domAttr, ioQuery) {
                    var sourceObject = ioQuery.queryToObject(source);
                    var url = "featureInfo_compare.jsp?url=" + service_url + "&request=GetFeatureInfo&service=WMS" + "&version=" + sourceObject.VERSION + "&query_layers=" + sourceObject.QUERY_LAYERS + "&crs=" + sourceObject.SRS + "&bbox=" + sourceObject.BBOX + "&width=" + sourceObject.WIDTH + "&height=" + sourceObject.HEIGHT + "&I=" + sourceObject.X + "&J=" + sourceObject.Y + "&time=" + cutDate(dijit.byId('time_slider').get('value'));
                    domAttr.set("featureInfo_frame", "src", url);
                });
            }
        }
    }
}

function correctDate(incoming_JSDate, changedDate_Int) {
    var period_JSON;
    var time_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {
            period_JSON = item;
        }
    });
    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });
    
    //setting time value to 0, when time (hours, minutes, seconds) information is not used 
    if (period_JSON.hour[vis_layer_number] <= 0 && period_JSON.minute[vis_layer_number] <= 0 && period_JSON.second[vis_layer_number] <= 0) 
    	incoming_JSDate.setHours(0);
    else if (period_JSON.minute[vis_layer_number] <= 0 && period_JSON.second[vis_layer_number] <= 0) 
    	incoming_JSDate.setMinutes(0);
    else if (period_JSON.second[vis_layer_number] <= 0)  
    	incoming_JSDate.setSeconds(0); 
    	 
    if (period_JSON.day[vis_layer_number] == null && period_JSON.month[vis_layer_number] == null && period_JSON.year[vis_layer_number] == null) {
        dijit.byId('fromDate_Input').set("value", incoming_JSDate);
    } else {

        if (dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), incoming_JSDate, 'day') <= 0
          && period_JSON.hour[vis_layer_number] <= 0 && period_JSON.minute[vis_layer_number] <= 0 && period_JSON.second[vis_layer_number] <= 0)
            incoming_JSDate = new Date(time_JSON.start[vis_layer_number]);
        if (dojo.date.difference(new Date(time_JSON.end[vis_layer_number]), incoming_JSDate, 'day') > 0)
            incoming_JSDate = new Date(time_JSON.end[vis_layer_number]);

        if (period_JSON.year[vis_layer_number] == 0) {
            if (period_JSON.month[vis_layer_number] == 0) {
                if (period_JSON.day[vis_layer_number] == 0) { 
                	if (period_JSON.hour[vis_layer_number] == 0) { 
                		if (period_JSON.minute[vis_layer_number] == 0) { 
                			if (period_JSON.second[vis_layer_number] == 0) {
                				console.log("An error in correcting date occured. period not set.");
                                
                			//seconds not null	
                			} else { 
                				//correcting the second of the date
                                var moduloDiff_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), incoming_JSDate, 'second') % period_JSON.second[vis_layer_number];
                                if (moduloDiff_Int == 0) {
                                    console.log("nothing to correct");
                                } else { 
                                    if (moduloDiff_Int > period_JSON.second[vis_layer_number] / 2) incoming_JSDate = dojo.date.add(incoming_JSDate, 'second', period_JSON.second[vis_layer_number] - moduloDiff_Int); 
                                    else incoming_JSDate = dojo.date.add(incoming_JSDate, 'second', -moduloDiff_Int); 
                                     
                                    if (changedDate_Int == 0) 
                                        dijit.byId('fromDate_Input').set("value", incoming_JSDate);   
                                }  
                			}
                		//minutes not null
                		} else { 
                			//correcting the minute of the date
                            var moduloDiff_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), incoming_JSDate, 'minute') % period_JSON.minute[vis_layer_number];
                            if (moduloDiff_Int == 0) {
                                console.log("nothing to correct"); 
                            } else { 
                                if (moduloDiff_Int > period_JSON.minute[vis_layer_number] / 2) incoming_JSDate = dojo.date.add(incoming_JSDate, 'minute', period_JSON.minute[vis_layer_number] - moduloDiff_Int); 
                                else incoming_JSDate = dojo.date.add(incoming_JSDate, 'minute', -moduloDiff_Int); 
                                 
                                if (changedDate_Int == 0) 
                                    dijit.byId('fromDate_Input').set("value", incoming_JSDate);   
                            }  
                		}
                	//hours not null
                	} else {
                		//correcting the hour of the date
                        var moduloDiff_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), incoming_JSDate, 'hour') % period_JSON.hour[vis_layer_number];
                        if (moduloDiff_Int == 0) {
                            console.log("nothing to correct"); 
                        } else { 
                            if (moduloDiff_Int > period_JSON.hour[vis_layer_number] / 2) incoming_JSDate = dojo.date.add(incoming_JSDate, 'hour', period_JSON.hour[vis_layer_number] - moduloDiff_Int); 
                            else incoming_JSDate = dojo.date.add(incoming_JSDate, 'hour', -moduloDiff_Int); 
                             
                            if (changedDate_Int == 0) 
                                dijit.byId('fromDate_Input').set("value", incoming_JSDate);   
                        }  
                	}
                } else {
                    //correcting the day of the date
                    var moduloDiff_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), incoming_JSDate, 'day') % period_JSON.day[vis_layer_number];
                    if (moduloDiff_Int == 0) {
                        console.log("nothing to correct"); 
                    } else {
                        if (moduloDiff_Int > period_JSON.day[vis_layer_number] / 2) incoming_JSDate = dojo.date.add(incoming_JSDate, 'day', period_JSON.day[vis_layer_number] - moduloDiff_Int);
                        else incoming_JSDate = dojo.date.add(incoming_JSDate, 'day', -moduloDiff_Int);
                         
                        if (changedDate_Int == 0) 
                            dijit.byId('fromDate_Input').set("value", incoming_JSDate); 
                    }
                }
            } else { //month not null
                if (period_JSON.day[vis_layer_number] == 0) {
                    //setting the day of the date to one
                    if (incoming_JSDate.getDate() > 14) {
                        incoming_JSDate.setDate(1);
                        incoming_JSDate = dojo.date.add(incoming_JSDate, 'month', 1);
                    } else {
                        incoming_JSDate.setDate(1);
                    }

                    //correcting the month value of the date
                    var moduloDiff_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), incoming_JSDate, 'month') % period_JSON.month[vis_layer_number];
                    if (moduloDiff_Int == 0) {
                        console.log("nothing to correct");
                    } else {
                        if (moduloDiff_Int > period_JSON.month[vis_layer_number] / 2) { //jump to next higher 
                            incoming_JSDate = dojo.date.add(incoming_JSDate, 'month', period_JSON.month[vis_layer_number] - moduloDiff_Int);
                        } else { //jump to next lower 
                            incoming_JSDate = dojo.date.add(incoming_JSDate, 'month', -moduloDiff_Int);
                        }
                    }
                    dijit.byId('fromDate_Input').set("value", incoming_JSDate);
                } else {
                    console.log("mixed period: month and date");
                }
            }
        } else { /*year not null */
            incoming_JSDate.setDate(1);
            if (incoming_JSDate.getMonth() > 6) {
                incoming_JSDate.setMonth(0);
                incoming_JSDate.setFullYear(incoming_JSDate.getFullYear() + 1);
            } else {
                incoming_JSDate.setMonth(0);
            }

            var moduloDiff_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), incoming_JSDate, 'year') % period_JSON.year[vis_layer_number];
            if (moduloDiff_Int == 0) {
                console.log("nothing to correct");
            } else {
                if (moduloDiff_Int > period_JSON.year[vis_layer_number] / 2) {
                    incoming_JSDate = dojo.date.add(incoming_JSDate, 'year', period_JSON.day[vis_layer_number] - moduloDiff_Int);
                } else {
                    incoming_JSDate = dojo.date.add(incoming_JSDate, 'year', -moduloDiff_Int);
                }
            }

            dijit.byId('fromDate_Input').set("value", incoming_JSDate);
        }

    } //else period given

    return incoming_JSDate;
}

function cutDate(date_String) {
    var period_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {
            period_JSON = item;
        }
    });

    var date_JSDate = new Date(date_String);
    if (period_JSON.second[vis_layer_number] > 0) {
    	return dojo.date.locale.format(date_JSDate, {
            locale: "de-de",
            datePattern: "yyyy-MM-dd hh:mm:sss",
            selector: "date"
        });
    } else {
    	if (period_JSON.minute[vis_layer_number] > 0) { 
    		date_JSDate = dojo.date.locale.format(date_JSDate, {
                locale: "de-de",
                datePattern: "yyyy-MM-dd hh:mm:sss",
                selector: "date"
            });
    		 
    		date_JSDate = date_JSDate.replace(/ /g, "T");
    		date_JSDate = date_JSDate.slice(0,20) + "Z";
        	 
    		return date_JSDate; 
    		 
        } else { 
        	if (period_JSON.hour[vis_layer_number] > 0) {
        		return dojo.date.locale.format(date_JSDate, {
                    locale: "de-de",
                    datePattern: "yyyy-MM-dd hh:mm:sss",
                    selector: "date"
                });
            } else { 
			    if (period_JSON.day[vis_layer_number] > 0) {
			        return dojo.date.locale.format(date_JSDate, {
			            locale: "de-de",
			            datePattern: "yyyy-MM-dd",
			            selector: "date"
			        });
			    } else {
			        if (period_JSON.month[vis_layer_number] > 0) {
			            return dojo.date.locale.format(date_JSDate, {
			                locale: "de-de",
			                datePattern: "yyyy-MM",
			                selector: "date"
			            });
			        } else {
			            return dojo.date.locale.format(date_JSDate, {
			                locale: "de-de",
			                datePattern: "yyyy",
			                selector: "date"
			            });
			        }
			    }
            }
	    }
    } 
    return date_JSDate;
}

//calculate new dates (add period) in given time range and adapt gui
var activeTime;

function playSequence() {   
    if (play_button.get('label') == "Animate map") {
        activeTime = window.setInterval("adaptPlayButton()", 2000);
    } else {
        window.clearInterval(activeTime); 
        play_button.set('label', 'Animate map');
    }
}

function adaptPlayButton() {
    var period_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {
            period_JSON = item;
        }
    });

    if (dijit.byId('time_slider').get('value') >= dijit.byId('time_slider').get('maximum')) {
        window.clearInterval(activeTime); 
        play_button.set('label', 'Animate map');
    } else {
        adaptSequenceGui(period_JSON);
    }
}

function adaptSequenceGui(period_JSON) {  
    play_button.set('label', 'Stop');
    var from_JSDate = dijit.byId('fromDate_Input').get('value');
    var newDate_JSDate = new Date(from_JSDate);

    if (period_JSON.year[vis_layer_number] > 0)
        newDate_JSDate = dojo.date.add(newDate_JSDate, 'year',
            parseInt(period_JSON.year[vis_layer_number]));
    if (period_JSON.month[vis_layer_number] > 0)
        newDate_JSDate = dojo.date.add(newDate_JSDate, 'month',
            parseInt(period_JSON.month[vis_layer_number]));
    if (period_JSON.day[vis_layer_number] > 0)
        newDate_JSDate = dojo.date.add(newDate_JSDate, 'day',
            parseInt(period_JSON.day[vis_layer_number]));
    if (period_JSON.hour[vis_layer_number] > 0)
        newDate_JSDate = dojo.date.add(newDate_JSDate, 'hour',
            parseInt(period_JSON.hour[vis_layer_number]));
    if (period_JSON.minute[vis_layer_number] > 0)
        newDate_JSDate = dojo.date.add(newDate_JSDate, 'minute',
            parseInt(period_JSON.minute[vis_layer_number]));
    if (period_JSON.second[vis_layer_number] > 0)
        newDate_JSDate = dojo.date.add(newDate_JSDate, 'second',
            parseInt(period_JSON.second[vis_layer_number]));

    dijit.byId('fromDate_Input').set("value", newDate_JSDate);
}