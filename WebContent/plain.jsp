<%@page import="org.apache.xml.utils.NSInfo"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
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
		
		<jsp:scriptlet><![CDATA[
		    String requestParam = "url=http://141.30.100.162:8080/ncWMS/wms&version=1.3.0&layer=mpi_echam5_sresa1b_2006-2099/tmp";
			String url = (String) request.getParameter("url");
			String version = "";
			if (request.getParameter("version") != null)
				version = (String) request.getParameter("version");
			String layer = (String) request.getParameter("layer");

			if (version.equals(""))
				version = "1.1.1";

			String jsonString;
			jsonString = controller.initialize(url, version, layer);
		]]></jsp:scriptlet>

		<script>dojoConfig = {parseOnLoad: true}</script>

		<script src="js/dojo-release-1.9.0/dojo/dojo.js" type="text/javascript" data-dojo-config=""></script>
		<link rel="stylesheet" type="text/css" href="js/dojo-release-1.9.0/dijit/themes/claro/claro.css" />
		
		<link rel="stylesheet" type="text/css" href="css/plain_styles.css" />
		<link href="js/ol3/build/ol.css" type="text/css" rel="stylesheet"/>
		
		<script src="js/required_dojo_scripts.js" type="text/javascript"></script>
		<script src="js/initialize_scripts.js" type="text/javascript"></script>
		<script src="js/map_setting.js" type="text/javascript"></script>
		<script src="js/layer_gui_setting.js" type="text/javascript"></script>
		<script src="js/feature_info_setting.js" type="text/javascript"></script>
		<script src="js/time_logic.js" type="text/javascript"></script>
		<script src="js/time_gui_setting.js" type="text/javascript"></script>
		<script src="js/time_combobox.js" type="text/javascript"></script>
		<script src="js/ol3/build/ol-simple.js" type="text/javascript"></script> 
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
        		identifier: 'paramName',
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
                    label: "Print map",
                    onClick: function(){
                        openPrintPreview();  
                    }
                }, "print_div");
                
        		wmsDescription_Store = new dojo.data.ItemFileReadStore({data: storeData, identifier: "id"})        ;
       			
        		if (empty == "<%=layer%>")         {
                    if (<%=url.contains("version")%> == "false")
                        location.href = "./layerchooser.jsp?url=<%=url%>&version=<%=version%>";
                    else {
            			<%=url = url.replace("?version", "&version")%>
                        location.href = "./layerchooser.jsp?direct=plain&url=<%=url%>";
					}
				} else {
					initializeMapping();
					initializeLayerGuiFilling();
					initializeTimeGuiFilling();
					buildToolTips();
				}
		        require(["dojo/dom-style"], function(domStyle){
		        	domStyle.set("time_slider", "width", "80%");
		        	domStyle.set("layerControlStatusBtn", "display", "none");
		        });
			}
 
		</script>
		
		<!--[if IE]><style type="text/css"> .clear { zoom: 1; display: block; } </style> <![endif]-->
	</head>
<body class="claro" style="background-color: #FFFFFF;" onload="init()">
	<div dojoType="dojo.data.ItemFileReadStore" data="storeData"
		jsId="wmsDescription_Store"></div>

	<div id="border_all" data-dojo-type="dijit/layout/BorderContainer"
		data-dojo-props='style:"width: 100%; height: 100%;"'>

		<div id="border_left" data-dojo-type="dijit/layout/BorderContainer"
			data-dojo-props='region: "center",style:"width: 800px; height: 470px;"'>

			<div role="navigation" data-dojo-type="dijit/layout/ContentPane"
				data-dojo-props='id:"border-left-top", region:"top", style:"height: 470px; width: 800px;",splitter:true,minSize:470'>
				
				<div id="map" class="map" style="height:96%; width:98%;float:left;"></div>
			</div>
			
			<div role="contentinfo" data-dojo-type="dijit/layout/ContentPane"
				data-dojo-props='id:"border-left-bottom", region:"center", style:"width: 800px;height: 200px; ",splitter:true,minSize:150,maxSize:850'>

				<!--div id="time" class="content_time" style="min-width:600px;">
					<label id="time_start_label">start time</label>
					<div style="z-index: 120 !important;">
						<label style="padding-top: 40px;">current time step: </label> 
						<input id="stateSelect" style="visibility: hidden;z-index: 120 !important;"/>
						<input id="fromDate_Input" />
						<label id="time_period_label" style="padding-top:20px;">period: </label>
					</div>
					<label id="time_end_label" style="float:left;">end time</label>
					<div id="time_slider" style="float:left;z-index: -12 !important;width: 600px;"></div>
						
					
					
					<div id="play" style="clear:left;padding-top: 20px;"> 
						<div id="playdiv" style="margin-left:-5px;padding-top:10px;">
							<div id="play_div"></div>
						</div>
					</div>
					<div id="printdiv" style="padding-top:10px;margin-left:-5px;">
					<div id="print_div"></div>
				</div-->
				<div id="time" class="content_time">
					<div id="time_container">
						<label id="time_start_label">start time</label>
						<label>current time step: </label> 
						<input id="stateSelect" style="visibility: hidden;z-index: 120 !important;"/>
						<input id="fromDate_Input" />
						<label id="time_period_label">period: </label>
						<div id="play">
							<div id="play_div"></div>
						</div>
						<label id="time_end_label">end time</label>
					</div>
					<div id="time_slider" style="z-index: -12 !important;"></div>
					<div id="printdiv">
							<div id="print_div"></div>
					</div>
				</div>
			</div>
		</div>

		<div id="border_right" data-dojo-type="dijit/layout/BorderContainer"
			data-dojo-props='region: "right",style:"width: 300px; height: 470px;", splitter:true'>

			<div role="navigation" data-dojo-type="dijit/layout/ContentPane"
				data-dojo-props='id:"border-right-top", region:"top", style:"width: 100px;height:150px;", splitter:true'>
				<div id="layerSwitcherCustom" style="position:relative;top:0px;float:right;overflow:visible;"></div>
			</div>

			<div role="navigation" data-dojo-type="dijit/layout/ContentPane"
				data-dojo-props='id:"border-right-center", region:"center", style:"width: 100px;height:150px;", splitter:true'>
 				<img style="border: none;" id="legend_frame"> 
			</div>
			<div role="contentinfo" data-dojo-type="dijit/layout/ContentPane"
				data-dojo-props='id:"border-right-bottom", region:"bottom", style:"height: 270px;", splitter:true'>
				<iframe style="border: none;height:400px;" id="featureInfo_frame" src="featureInfo.jsp"></iframe>
			</div>
		</div>
	</div>
</body>
</html>