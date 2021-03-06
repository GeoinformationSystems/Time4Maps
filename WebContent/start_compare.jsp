<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> 
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>    
<jsp:useBean id="controller" class="tud.time4maps.controlling.RequestControlling" scope="session"></jsp:useBean>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<!-- 
		
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
		  -->
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>GLUES COMPARE2MAPS</title> 
	<link href="images/favicon.ico" rel="shortcut icon" />
	<link href="images/favicon.ico" rel="icon" />
	<jsp:scriptlet>
		<![CDATA[                  
		String requestParam = "url=http://141.30.100.162:8080/ncWMS/wms&version=1.3.0&layer=mpi_echam5_sresa1b_2006-2099/tmp";		
		String url = (String) request.getParameter("url");
		String version = (String) request.getParameter("version");
		String layer = (String) request.getParameter("layer");
		String jsonString;
		jsonString = controller.initialize(url, version, layer);
		String url2 = (String) request.getParameter("url2");
		String version2 = (String) request.getParameter("version2");
		String layer2 = (String) request.getParameter("layer2");
		String jsonString2; 
		jsonString2 = controller.initialize(url2, version2, layer2);
		]]>
	</jsp:scriptlet>
	
	<script src="js/dojo-release-1.9.0/dojo/dojo.js" type="text/javascript"></script>
	<script src="js/required_dojo_scripts.js" type="text/javascript"></script>
	<script src="js/initialize_scripts.js" type="text/javascript"></script>
	<script src="js/map_setting_compare.js" type="text/javascript"></script>
	<script src="js/layer_gui_setting_compare.js" type="text/javascript"></script>
	<script src="js/feature_info_setting_compare.js" type="text/javascript"></script>
	<script src="js/time_logic_compare.js" type="text/javascript"></script>
	<script src="js/time_gui_setting_compare.js" type="text/javascript"></script>
	<script src="js/time_combobox_compare.js" type="text/javascript"></script>
	<script src="js/ol3/build/ol-debug.js" type="text/javascript"></script>
	<script src="js/print.js" type="text/javascript"></script>
	
	<link rel="stylesheet" type="text/css" href="js/dojo-release-1.9.0/dijit/themes/claro/claro.css" />
	<link href="css/basic_styles.css" rel="stylesheet" type="text/css" />
	<link href="css/additional_styles.css" rel="stylesheet" type="text/css" />
	<link href="js/ol3/css/ol.css" type="text/css" rel="stylesheet"/>
	
	<script>
		if (<%=jsonString%> == null || <%=jsonString2%> == null) { 
			alert("Connection error. One of the map services is not available. Please check the service or contact the support team. Loading of the application stops now.");
			window.stop();
		}
	
		var play_button;
	    var print_button;
		var wmsDescription_Store, wmsDescription_Store2; 
		var storeData = { identifier: 'paramName', items: [ <%=jsonString%> ]};
		var storeData2 = { identifier: 'paramName', items: [ <%=jsonString2%> ]};	
		function init() { 
			play_button = new dijit.form.Button({
		        label: "Animate map",
		        onClick: function(){ 
		            playSequence(); 
		        }
		    }, "play_div");
	            print_button = new dijit.form.Button({
	                    label: "Print",
	                    onClick: function(){
	                        openPrintPreview();
	                        //getTiles();
	                    }    
	                }, "print_div");
	            
			wmsDescription_Store = new dojo.data.ItemFileReadStore({data:storeData, identifier:"id"});
			wmsDescription_Store2 = new dojo.data.ItemFileReadStore({data:storeData2, identifier:"id"});	
			
			var empty = null;
			
			initializeMapping(); 
			initializeLayerGuiFilling();  
			initializeTimeGuiFilling(); 		
			buildToolTips(); 
		}	
	</script> 
	<!--[if IE]>
	<style type="text/css"> .clear { zoom: 1; display: block; } </style>
	<![endif]-->
</head>
<body class="claro" style="" onload="init()">	
    <div dojoType="dojo.data.ItemFileReadStore" data="storeData" jsId="wmsDescription_Store"></div> <!-- data: JSON object, jsId: the store id (to call later) -->
    <div dojoType="dojo.data.ItemFileReadStore" data="storeData2" jsId="wmsDescription_Store2"></div> <!-- data: JSON object, jsId: the store id (to call later) -->        
    <div id="page" style="width:1450px;"> 		 
        <div class="header_logo"></div>
        <div class="header_title" style="position:absolute; left:30px;"><h1 style="width:500px;">COMPARE 2 MAPS</h1></div>	  
        <div class="line"></div>
    </div>     
    <div id="description" class="content_description" style="left:210px;top:-5px;">
        <h2 id="description_wms_title" style="width:490px;position:absolute; left:90px;top:110px;"></h2>
        <h2 id="description_wms_title2" style="width:490px;position:absolute; left:570px;top:110px;"></h2>	          
    </div>
    <div id="map" class="map3" style="left:300px;top:180px;"></div>
    <div id="map2" class="map2" style="left:780px;top:180px;"></div>
    <div id="legendimage" style="position: absolute; top:180px; left:100px;height:280px;width:185px;overflow:auto;">
        <!-- iframe id="legend_frame" style="border:none;width:280px;height:280px;"></iframe -->
        <img id="legend_frame">
    </div>
        
    <div id="legendimage2" style="position: absolute; top:180px; left:1260px;height:280px;width:290px;overflow:auto;">
         <img id="legend_frame2">
    </div>
        
    <div id="time" class="content_time" style="left:380px;top:710px; z-index: 0;">
        <label id="time_start_label">start time</label>
        <div style="float:left; padding-top:10px; padding-left:70px;z-index:120 !important;">
            <label style="padding-top:10px;">current time step: </label>
            <input id="stateSelect" style="visibility:hidden;float: left;padding-left: 70px;padding-top: 10px;z-index: 120 !important;">
            <input id="fromDate_Input" type="text" name="fromDate_Input" dojoType="dijit.form.DateTextBox" required="true" onChange="fromDateChanged" style="z-index:10000 !important;"/>			
        </div>
        <label id="time_end_label" class="right" style="padding-top:10px;">end time</label>            
        <div id="play">
            <div id="playdiv" style="padding-left:450px;padding-top:5px;">
                <div id="play_div"></div>
            </div>	  		
            <div id="time_slider" style="z-index:-12 !important;"></div>								
        </div>
    </div>
    <div id="featureInfo_div" style="left:300px;top:530px;width:930px;height:180px;">  
        <iframe style="border:none;width:465px;height:180px;float:left;" id="featureInfo_frame1" src="featureInfo_compare.jsp"></iframe>  
        <iframe style="border:none;width:465px;height:180px;float:right;" id="featureInfo_frame2" src="featureInfo_compare.jsp"></iframe>
    </div>
    <div id="printdiv" style="position: absolute; top: 715px; left: 975px; z-index: 0;">
        <div id="print_div"></div>
    </div>
</body></html>