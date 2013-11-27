<%
/**
 * Copyright (c) 2000-2011 Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */
%>

<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<%@ page import="com.liferay.portal.theme.ThemeDisplay"%>
<%@ page import="com.liferay.portal.kernel.util.WebKeys"%>
<%@ page import="com.liferay.portal.model.User"%>

<!-- 
<link rel="stylesheet"
	href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
	
 -->
 <script src="http://cdn.alloyui.com/2.0.0/aui/aui-min.js"></script>
<link rel="stylesheet"
	href="<%= request.getContextPath()%>/css/main.css" />

<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
<!-- 
<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
 -->
<script
	src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
<script src="<%=request.getContextPath()%>/js/gloriapi.js"></script>
<script src="<%=request.getContextPath()%>/js/main.js"></script>
<script src="<%=request.getContextPath()%>/js/jquery.carouFredSel-6.2.1.js"></script>

<script
 src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular-resource.min.js"></script>

<!-- 
<script>
$(function() {
	var availableTags = new Array();
	
	for (var i=0;i<110;i++){
		availableTags[i] = "M"+(i+1);
	}
	
	$( "#tags" ).autocomplete({
	source: availableTags
	});
});
</script>
 -->
<%
	ThemeDisplay themeDisplay = (ThemeDisplay) request
			.getAttribute(WebKeys.THEME_DISPLAY);
	User user = themeDisplay.getUser();
%>

<div id="container" ng-app="gloria" ng-controller="InitDevices">
	
	<div ng-init="user='<%= user.getEmailAddress() %>';password='<%= user.getPassword() %>';reservation=167">
	</div>

	<div id="hand_controller" style="background-image:url(<%=request.getContextPath()%>/images/Template.jpg); background-position:left top;width:100%;height:800px; background-repeat: no-repeat">

		<div id="left_controls">
			<!-- <div style="margin-left:43px;">
				<img src="<%=request.getContextPath()%>/images/arrow_up.jpg" height="14px" width="20px"/>
			</div> -->
			<div id="surveillance_panel" ng-controller="GetCamerasCtrl">

			</div>
		</div>
		<div id="right_controls">
			<div>
				<span class="title">MOUNT</span>
				<div id="mount_target_parameters">
					<div>
						<span class="regular">RA:&nbsp;&nbsp;&nbsp;&nbsp;</span>
						<input id="coords_ra" class="input_text" size="6"></input>
					</div>
					<div>
						<span class="regular">DEC:&nbsp;&nbsp;</span>
						<input id="coords_dec" class="input_text" size="6"></input>
					</div>
					<div>
						<span class="regular">NAME: </span>
						<input id="tags" class="input_text" size="6"></input>
					</div>
					<!-- <span class="regular">STATUS:</span> -->
					<div align="center" class="status">
						<span class="status_text">READY</span>
					</div>
					
					<div id="mount_buttons_panel">
						<button class="button_style"><span class="button_text">GO</span></button>
					</div>				
				</div>
			</div>
			<div id="main_ccd_panel">
				<span class="title">MAIN CCD</span>
				<div id="main_ccd_parameters" ng-controller="CcdDevice">
					<div>
						<table>
							<tr>
								<td><span class="regular">TIME:</span></td>
								<td><input id="exposure_time" class="input_text" size="6" ng-model="exposure_time"></td>
							</tr>
							<tr>
								<td><span class="regular">FILTER:</span></td>
								<td>
									<select id="filter_selector" class="selector" ng-model="filter" ng-change="setFilter()">
										<option ng-repeat="filter in filters_0">{{filter}}</option>
									</select>
								</td>
							</tr>
							<tr>
								<td><span class="regular">BINNING:</span></td>
								<td><select id="binning_selector" class="selector" ng-model="binning"><option>1x1</option></select></td>
							</tr>
						</table>
					</div>
					<div align="center" class="status" ng-model="status_main_ccd" ng-init="status_main_ccd='READY'">
						<span class="status_text">{{status_main_ccd}}</span>
					</div>
					<div id="main_ccd_buttons_panel">
						<button class="button_style" ng-click="expose()"><span class="button_text">START</span></button>
					</div>
				</div>
			</div>
		</div>
		<div id="main_image">
			<img id="image_0" src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" height="500px" width="500px"/>
		</div> 
	</div>
	<div class="image_carousel">
		<div id="foo1">
			<!-- <img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" height="80px" width="80px"/>
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" height="80px" width="80px"/>
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" height="80px" width="80px"/>
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" height="80px" width="80px"/>
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" height="80px" width="80px"/>
			 -->
		</div>
		<div class="clearfix"></div>
		<a class="prev" id="foo1_prev" href="#"><span>prev</span></a>
		<a class="next" id="foo1_next" href="#"><span>next</span></a>
	</div>
</div>
<script>
$("#foo1").carouFredSel({
	circular: false,
	infinity: false,
	auto : false,
	responsive:true,
	items: 4,
	prev : "#foo1_prev",
	next : "#foo1_next"
});
</script>