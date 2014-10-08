<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<jsp:useBean id="controller"
	class="tud.time4maps.controlling.RequestControlling" scope="session"></jsp:useBean>
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
	
	<script src="js/dojo-release-1.9.0/dojo/dojo.js" type="text/javascript"></script>
	<script src="js/required_dojo_scripts.js" type="text/javascript"></script>
	
	<link rel="stylesheet" type="text/css" href="js/dojo-release-1.9.0/dijit/themes/claro/claro.css" />
	<link href="css/basic_styles.css" rel="stylesheet" type="text/css" />
	<link href="css/additional_styles.css" rel="stylesheet" type="text/css" />
	
	<!--[if IE]> <style type="text/css"> .clear { zoom: 1; display: block; } </style><![endif]-->
	<style type="text/css"> .dijitButtonText { width: 150px; } </style>
	
	<jsp:scriptlet><![CDATA[
	        String requestParam = "url=http://141.30.100.162:8080/ncWMS/wms&version=1.3.0&layer=mpi_echam5_sresa1b_2006-2099/tmp";
			String url = (String) request.getParameter("url");

			String version = "";
			if (request.getParameter("version") != null)
				version = (String) request.getParameter("version");
			if (version.equals(""))
				version = "1.1.1";

			String layer = (String) request.getParameter("layer");
			String jsonString = controller.getLayers(url, version);

			String direct = request.getParameter("direct");
	]]></jsp:scriptlet>
	<script> 
		dojo.require("dojo.data.ItemFileReadStore"); 
		dojo.require("dijit.form.Button");
		dojo.require("dijit.form.CheckBox"); 
		var wmsDescription_Store;
		var storeData = {
			identifier: 'paramName', //each element and sub element must have an attribute 'paramName'
			items: [ <%=jsonString%> ] 
		};
		function init() {
			var checkedAll = false;
			var load_button = new dijit.form.Button({
		        label: "View in TIME4MAPS",
		        onClick: function(){ 
		            reload(); 
		        }
		    }, "load"); 

		    new dijit.form.Button({
		    	label: "Select All/None",
		    	onClick: function(){
					//select or deselect all checkboxes
					var mapping_JSON = null;
					require(["dojo/query", "dijit/registry"], function(query, registry){
						wmsDescription_Store.fetchItemByIdentity({
							identity: "layers",
							onItem: function(item, request){
								mapping_JSON = item;
							}
						});

						for (var i=0; i<mapping_JSON.number[0]; i++){
							(!checkedAll)? (registry.byId("layer_"+i).set("checked", true)):(registry.byId("layer_"+i).set("checked", false));
						}
						
						(checkedAll) ? (checkedAll = false ) : (checkedAll = true);
					});

		    	}
		    }, "btn_selectAll");
		   	var mapping_JSON;
		   	wmsDescription_Store = new dojo.data.ItemFileReadStore({data:storeData, identifier:"id"});
		   	wmsDescription_Store.fetchItemByIdentity({ identity: "layers", onItem: function(item, request) { mapping_JSON = item; }});    
		   	var DefCharSpan = dojo.doc.createElement("span");
		   	
		   	if (mapping_JSON.number[0] == 1) {
			   var layername = wmsDescription_Store.getValues(mapping_JSON, "layer_0")[0].name[0];
			   location.href = "./index.jsp?url=<%=url%>&version=<%=version%>&layer="+layername;			
		   	} else {
			 for (var k = 0; k < mapping_JSON.number[0]; k++) {
				var layer = wmsDescription_Store.getValues(mapping_JSON, "layer_"+k);  
			 	var DefCharCheckbox = new dijit.form.CheckBox({
		            name: layer[0].name[0] + "//" + layer[0].title[0],
		            id: "layer_" +k,
		            value: layer[0].name[0] + "//" + layer[0].title[0],
		            checked: false
		     	});
		        var DefCharLabel = dojo.doc.createElement("span");
		        DefCharLabel.innerHTML = "name: " + layer[0].name[0] + " title: " + layer[0].title[0];
		        var DefCharBreak = dojo.doc.createElement("br");
		        DefCharSpan.appendChild(DefCharCheckbox.domNode);
		        DefCharSpan.appendChild(DefCharLabel);
		        DefCharSpan.appendChild(DefCharBreak);
		        dojo.place(DefCharSpan, dojo.byId("cb"), "last");
			 }
		   }
		}
		function reload() {
			var layers = "";
			var layer_set = false;	
			var mapping_JSON;        
			wmsDescription_Store.fetchItemByIdentity({ identity: "layers", onItem: function(item, request) { mapping_JSON = item; }});
			for (var k = 0; k < mapping_JSON.number[0]; k++) {
				var layer = wmsDescription_Store.getValues(mapping_JSON, "layer_"+k);  
				if (dijit.byId("layer_" + k).get("checked")) {
					if (layer_set) 
						layers += "," + layer[0].name[0];
					else {
						layers += layer[0].name[0];
						layer_set = true;
					}
				}
			}
			
			if (layers != "") 
				location.href = "./<%=direct%>.jsp?url=<%=url%>&version=<%=version%>&layer=" + layers;
			else
				alert("Please choose at least one layer!");
		}
	</script>
</head>
<body class="claro" style="background-color: #FFFFFF;" onload="init()">
	<div dojoType="dojo.data.ItemFileReadStore" data="storeData" jsId="wmsDescription_Store"></div>
	<!-- data: JSON object, jsId: the store id (to call later) -->
	<div id="description" class="content_description" style="left: 10px; top: 15px;">
		<h2 id="description_wms_title" style="left: 10px; top: 15px;">Visualize
			layers in Time4Maps</h2>
		<div id="cb" style="padding-top: 30px;"></div>
		<div id="load"></div>
		<div id="btn_selectAll"></div>
	</div>
</body>
</html>