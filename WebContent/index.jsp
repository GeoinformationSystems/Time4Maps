<%@page import="org.apache.xml.utils.NSInfo"%>
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
            <title>GLUES TIME4MAPS</title> 
            <link href="images/favicon.ico" rel="shortcut icon" />
            <link href="images/favicon.ico" rel="icon" />
        <jsp:scriptlet>
	<![CDATA[                  
	String requestParam = "url=http://141.30.100.162:8080/ncWMS/wms&version=1.3.0&layer=mpi_echam5_sresa1b_2006-2099/tmp";		
	String url = (String) request.getParameter("url");
	String version = "";
	if (request.getParameter("version") != null) version = (String) request.getParameter("version");
	String layer = (String) request.getParameter("layer");
	
	if (version.equals("")) version = "1.1.1";
	
	String jsonString;
	jsonString = controller.initialize(url, version, layer);
	]]>
        </jsp:scriptlet>
        <link rel="stylesheet" type="text/css" href="js/dojo-release-1.9.0/dijit/themes/claro/claro.css" />
        <link rel="stylesheet" type="text/css" href="js/dojo-release-1.9.0/dijit/themes/claro/form/Button.css" />
        <link href="css/basic_styles.css" rel="stylesheet" type="text/css" />
        <link href="css/additional_styles.css" rel="stylesheet" type="text/css" /> 
        <link href="js/ol3/build/ol.css" type="text/css" rel="stylesheet"/>
        <script src="js/dojo-release-1.9.0/dojo/dojo.js" type="text/javascript" data-dojo-config=""></script>
        <script src="js/required_dojo_scripts.js" type="text/javascript"></script>
        <script src="js/initialize_scripts.js" type="text/javascript"></script>
        <script src="js/map_setting.js" type="text/javascript"></script>
        <script src="js/layer_gui_setting.js" type="text/javascript"></script>
        <script src="js/feature_info_setting.js" type="text/javascript"></script>
        <script src="js/time_logic.js" type="text/javascript"></script>
        <script src="js/time_gui_setting.js" type="text/javascript"></script>
        <script src="js/time_combobox.js" type="text/javascript"></script>
        <script src="js/ol3/build/ol-simple.js" type="text/javascript"></script>
        <!--script src="js/OpenLayers-2.12/OpenLayers.js" type="text/javascript"></script>
        <script src="js/OpenLayers-2.12/deprecated.js" type="text/javascript"></script-->
        <script src="js/layerControl.js" type="text/javascript"></script>
        <script src="js/print.js" type="text/javascript"></script>
        <script>
            var empty = "null";
        
            if (<%=jsonString%> == null) {
                alert("Connection error. The map service is not available. Please check the service or contact the support team. Loading of the application stops now.");
                window.stop();
            }

            var play_button;
            var print_button;
            var wmsDescription_Store;
            var storeData = {
        		identifier: 'paramName'        ,
                items: [<%=jsonString%>]
            };

            function init() {
                play_button = new dijit.form.Button({
                    label: "Animate map",
                    onClick: function() {
                        playSequence();
                    }
                }, "play_div");
                
                print_button = new dijit.form.Button({
                    label: "print",
                    onClick: function(){
                        openPrintPreview();  
                    }
                }, "print_div");
                
        wmsDescription_Store = new dojo.data.ItemFileReadStore({data: storeData, identifier: "id"})        ;
        if (empty == "<%=layer%>")         {
                    if (<%=url.contains("version")%> == "false")
                        location.href = "./layerchooser.jsp?url=<%=url%>&version=<%=version%>";
                    else {
            <%=url=url.replace("?version","&version")%>
                        location.href = "./layerchooser.jsp?direct=index&url=<%=url%>";
                    }
                } else {
                    initializeMapping();
                    initializeLayerGuiFilling();
                    initializeTimeGuiFilling();
                    buildToolTips();
                }
            }
        </script> 
        <!--[if IE]>
        <style type="text/css"> .clear { zoom: 1; display: block; } </style>
        <![endif]-->
    </head>
    <body class="claro" style="background-color:#FFFFFF;" onload="init()">	
        <div dojoType="dojo.data.ItemFileReadStore" data="storeData" jsId="wmsDescription_Store"></div>
        <div id="description" class="content_description" style="left:10px;top:15px;width:800px;">
            <h2 id="description_wms_title" style="width:800px;"></h2>	          
        </div>  	
        <div id="map" class="map" style="left:10px;top:60px;"></div>
        <!--img id="legend_frame" style="top:60px;left:860px;"/-->        
        <div id="time" class="content_time" style="left:10px;top:540px;">	
            <label id="time_start_label">start time</label>
            <div style="float:left; padding-top:10px; padding-left:70px;z-index:120 !important;">
                <label style="padding-top:10px;">current time step: </label>
                <input id="stateSelect" style="visibility:hidden;float: left;padding-left: 70px;padding-top: 10px;z-index: 120 !important;">
                <input id="fromDate_Input"/>
            </div>
            <label id="time_end_label" class="right" style="padding-top:10px;">end time</label>            
            <div id="play">
                <div id="playdiv" style="padding-left:450px;padding-top:5px;">
                    <div id="play_div"></div>
                </div>
                <div id="time_slider" style="z-index:-12 !important;"></div>								
            </div>
        </div>
        <div id="featureInfo_div" style="left:830px;top:350px;height:180px;width:330px;">  
            <iframe style="border:none;width:330px;height:180px;" id="featureInfo_frame" src="featureInfo.jsp" ></iframe>  
        </div> 
        <div id="legend_div" style="left:830px;top:60px;position:absolute;height:280px;width:330px;overflow:auto;">  
            <img style="border:none;" id="legend_frame"><!-- /IFrame -->  
      	</div>
      	<div id="layerSwitcherCustom" style="background-color:white;top:61px;position:absolute;left:511px;"></div>
        <div id="printdiv" style="position: absolute; left:930px; top:565px">
            <div id="print_div"></div>
        </div>
    </body></html>
