<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>    
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
	<script src="js/dojo-release-1.9.0/dojo/dojo.profile.js" type="text/javascript"></script> 
	<script src="js/required_dojo_scripts.js" type="text/javascript"></script>
	<link href="js/dojo-release-1.9.0/dijit/themes/claro/claro.css" rel="stylesheet" type="text/css" />
	<link href="css/basic_styles.css" rel="stylesheet" type="text/css" />
	<link href="css/additional_styles.css" rel="stylesheet" type="text/css" />
	<!--[if IE]> <style type="text/css"> .clear { zoom: 1; display: block; } </style> <![endif]-->
	<style type="text/css"> .dijitButtonText { width: 150px; } </style>
	
	<script> 
		function init() {
			var load_button = new dijit.form.Button({
		        label: "View in TIME4MAPS",
		        onClick: function(){ 
		            reload(); 
		        }
		    }, "load"); 
			var data_list = [];
			data_list.push({ name : "1.3.0" });
			data_list.push({ name : "1.1.1" });  
			var data = {
				identifier : 'name',
				items : []
			}; 
			for ( var i = 0, l = data_list.length; i < data_list.length; i++) {
				data.items.push(dojo.mixin({
					id : i + 1
				}, data_list[i % l]));
			} 
			dataStore = new dojo.data.ItemFileWriteStore({ data : data }); 
			var comboBox = new dijit.form.ComboBox({
		        id: "input_version",
		        name: "version", 
		        store: dataStore,
		        value: "1.3.0",
		        searchAttr: "name",
		        onChange: function(value) {   
			        console.log(value); 
			    }
		    }, "input_service_version");
		}
		function reload() {
			if (dojo.byId('input_service_url').value == "") alert ("Please fill in an url.");
			else location.href = "./index.jsp?url="+dojo.byId('input_service_url').value+"&version="+dijit.byId('input_version').get('value')+"&layer="+dojo.byId('input_layer_names').value;			
		} 
	</script>  
	</head>
<body class="claro" style="background-color:#FFFFFF;" onload="init()">
	<div id="description" class="content_description" style="left:10px;top:15px;">
		<h2 id="description_wms_title" style="left:10px;top:15px;">Load a service in Time4Maps</h2>	              
		<table style="padding-top:30px;"> 
	  		<tr><td><label id="service_url">Service URL</label></td>	 
	    		<td><input id="input_service_url" style="width:400px;"></td>
	    		<td>E.g. "http://glues.pik-potsdam.de:8080/thredds/wms/pik_wcrp_cmip3/miroc3_2_medres_sresa2_2006-2099_tmp.nc?"</td>
	    	</tr> 
	    	<tr><td><label id="layer_names">Layer Names</label></td>	 
	    		<td><input id="input_layer_names" style="width:400px;"></td>
	    		<td>E.g. "tmp". Separate layer names with "," if you like to see more than one layer. 
	    		Leave this input empty if you would like to see the first layer of this service.</td>
	    	</tr>
	    	<tr><td><label id="service_version">Service version</label></td>	 
	    		<td><input id="input_service_version" style="visibility:hidden;float: left;padding-left: 70px;padding-top: 10px;z-index: 120 !important;"></td>
	    		<td>Possible values are "1.3.0" and "1.1.1".</td> 
	    </table>	
	    <div id="load"></div></div></body></html>