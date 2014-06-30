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
	<script src="js/dojo-release-1.9.0/dojo/dojo.js" type="text/javascript"></script>
	<jsp:scriptlet><![CDATA[String url = (String) request.getParameter("url");
			String version = (String) request.getParameter("version");
			String query_layers = (String) request.getParameter("query_layers");
			String url2 = (String) request.getParameter("url2");
			String version2 = (String) request.getParameter("version2");
			String query_layers2 = (String) request.getParameter("query_layers2");
			String bbox = (String) request.getParameter("bbox");
			String crs = (String) request.getParameter("crs");
			String width = (String) request.getParameter("width");
			String height = (String) request.getParameter("height");
			String i = (String) request.getParameter("I");
			String j = (String) request.getParameter("J");
			String time = (String) request.getParameter("time");
			String featureInfo = "<div style=\'float:left;width:480px;\'>";
			if (url != null)
				featureInfo += controller.initializeFeatureInfo(url, version,
						query_layers, crs, bbox, width, height, i, j, time);
			featureInfo += "</div><div style=\'float:left;width:400px;\'>";
			if (url2 != null)
				featureInfo += controller.initializeFeatureInfo(url2, version2,
						query_layers2, crs, bbox, width, height, i, j, time);
			featureInfo += "</div>";]]>
	</jsp:scriptlet>
	<script>
		function fill() {	 
			dojo.byId('feature_label').innerHTML = "<%=featureInfo%>";
			if (dojo.byId('feature_label').innerHTML == "")
				dojo.byId('feature_label').innerHTML = "Click on the map to get feature information."
		}
	</script>
	<link href="css/additional_styles.css" rel="stylesheet" type="text/css" />
</head>
<body onload="fill()">
	<div id="featureinfo">
		<label id="feature_label">Click on the map to get feature information.</label>
	</div>
</body>
</html>