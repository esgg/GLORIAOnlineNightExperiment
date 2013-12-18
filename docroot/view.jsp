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
<%@ page import="java.util.Locale" %>
<%@ page import="java.util.ResourceBundle" %>
<%@ page import="com.liferay.portal.util.PortalUtil"%>

<!-- 
<link rel="stylesheet"
	href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
	
 -->
 <script src="http://cdn.alloyui.com/2.0.0/aui/aui-min.js"></script>
<link rel="stylesheet"
	href="<%= request.getContextPath()%>/css/main.css" />
<link rel="stylesheet" type="text/css" media="all" href="<%= request.getContextPath()%>/js/prettyphoto/css/prettyPhoto.css">
<link rel="stylesheet" type="text/css" media="all" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css">

<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
 
<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>

<script
	src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
<script src="<%=request.getContextPath()%>/js/gloriapi.js"></script>
<script src="<%=request.getContextPath()%>/js/main.js"></script>
<script src="<%=request.getContextPath()%>/js/prettyphoto/js/jquery.prettyPhoto.js"></script>
<script src="<%=request.getContextPath()%>/js/jquery.carouFredSel-6.2.1.js"></script>

<script
 src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular-resource.min.js"></script>

<%
	ThemeDisplay themeDisplay = (ThemeDisplay) request
			.getAttribute(WebKeys.THEME_DISPLAY);
	User user = themeDisplay.getUser();
	String reservationId = PortalUtil.getOriginalServletRequest(request).getParameter("reservation"); 
	//String language = themeDisplay.getLanguageId();
	//ResourceBundle rb =  ResourceBundle.getBundle("content.mount.Language");
%>
  

 
<div id="load_init" style="background-color:#000000;opacity:0.8;height:100%;width:100%;position:absolute;z-index:700">
<div style="font-size:30px;width:100%;height:100px;text-align:center;margin-top:300px;color:#FFFFFF">
	<img id="init_image" src="<%=request.getContextPath()%>/images/init_loading.gif" height="15px" width="128px" margin-top:300px;color:#FFFFFF/><span id="loading_message">&nbsp;</span>
</div>
</div>

<div id="container" ng-app="gloria" ng-controller="InitDevices" style="background-color:#000000;">
	
	<div ng-init="user='<%= user.getEmailAddress() %>';password='<%= user.getPassword() %>';reservation=<%= reservationId %>;">
	</div>

	<div id="hand_controller" style="background-image:url(<%=request.getContextPath()%>/images/Template.jpg); background-position:left top;width:100%;height:800px; background-repeat: no-repeat">

		<div id="left_controls">
			<!-- <div style="margin-left:43px;">
				<img src="<%=request.getContextPath()%>/images/arrow_up.jpg" height="14px" width="20px"/>
			</div> -->
			<div id="surveillance_panel" ng-controller="GetCamerasCtrl">

			</div>
		</div>
		<div id="right_controls" ng-controller="MountDevice">
			
				<div id="hand_controller_pad" style="position: absolute;top: -50px;left: 35px;">
					<table>
						<tr>
							<td></td>
							<td style="padding-left:2px;padding-right:2px;text-align:center">
								<img id="top_arrow_pad" src="<%=request.getContextPath()%>/images/hand_arrow_top.png" width="20px" class="bright-button"/>
							</td>
							<td></td>
						</tr>
						<tr>
							<td>
								<img id="left_arrow_pad" src="<%=request.getContextPath()%>/images/hand_arrow_left.png" width="10px" class="bright-button"/>
							</td>
							<td></td>
							<td>
								<img id="right_arrow_pad" src="<%=request.getContextPath()%>/images/hand_arrow_right.png" width="10px" class="bright-button"/>
							</td>						
						</tr>
						<tr>
							<td></td>
							<td style="padding-left:4px;padding-right:2px;">
								<img id="down_arrow_pad" src="<%=request.getContextPath()%>/images/hand_arrow_down.png" width="20px" class="bright-button"/>
							</td>
							<td></td>
						</tr>						
					</table>
				</div>
				<div id="mount_target_parameters">
					<span class="title">MOUNT</span>
					<div>
						<span class="regular">RA:&nbsp;&nbsp;&nbsp;&nbsp;</span>
						<input id="coords_ra" class="input_text" ng-model="ra" size="6"></input>
					</div>
					<div>
						<span class="regular">DEC:&nbsp;&nbsp;</span>
						<input id="coords_dec" class="input_text" ng-model="dec" size="6"></input>
					</div>
					<div>
						<span class="regular">NAME: </span>
						<input id="tags" class="input_text" ng-model="target_name" size="6"></input>
					</div>
					<!-- <span class="regular">STATUS:</span> -->
					<div align="center" class="status">
						<span class="status_text">READY</span>
					</div>
					
					<div id="mount_buttons_panel">
						<button class="button_style"  ng-click="go()" ><span class="button_text">GO</span></button>
					</div>				
				</div>
			
			<div id="main_ccd_panel">
				<span class="title">MAIN CCD</span><a id="ccd_alert" href="#"><span id="ccd_budge" class="badge badge-important" style="visibility:hidden">0</span></a>
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
								<td><select id="binning_selector" class="selector" ng-model="binning" ng-init="binning='1x1'"><option>1x1</option></select></td>
							</tr>
						</table>
					</div>
					<div align="center" class="status" ng-model="status_main_ccd" ng-init="status_main_ccd='READY'">
						<span id="ccd_status" class="status_text">{{status_main_ccd}}</span>
					</div>
					<div id="main_ccd_buttons_panel">
						<button id="expose_0_button"class="button_style" ng-click="expose()"><span class="button_text">START</span></button>
					</div>
				</div>
			</div>
		</div>
		<div id="reference_focuser"></div>
		<div id="focus_marker">
			<div id="focus_marker_info">0</div>
		</div>
		 <div style="width:500px;position:absolute;top:80px;left:270px;">
		<div id="main_image">
			<div id="loading" style="text-align:center;position:absolute;top:210px;left:125px;visibility:hidden">
				<img src="<%=request.getContextPath()%>/images/init_loading.gif" width="256px" height="30px"/> 
			</div>
			
			<div id="main_image_container" style="margin-left:0px;">
				<img id="image_0" src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg"/>	
			</div> 
		</div>
		 </div>
		<div id="ccd_button_1" class="ccd_button" style="position:absolute;top:525px;left:250px;" ng-controller="CcdDevice" ng-click="setOrder(1)">
			CCD1
		</div>
		<div id="ccd_button_0" class="ccd_button_selected" style="position:absolute;top:525px;left:710px;" ng-controller="CcdDevice" ng-click="setOrder(0)">
			CCD0
		</div>
	</div>
	<!-- 
	<div id="focuser" class="focuser_opacity">
		<p class="regular">
  			Position:<span id="amount" style="font-weight:bold;"></span>
		</p>
		<div id="slider-range-min"></div>
	</div>
	 -->
	<div id="gloria_info">
		<div id="weather_station" ng-controller="WeatherDevice" style="width:400px;margin:0 auto;">

			<div style="float:left; display:inline-block;width:33%">
				<div style="float:left">
					<img height="32px" width="32px" src="<%=request.getContextPath()%>/images/humidity.png"/>
				</div>
				<div class="weather_condition_value">
					<label class="no_alarm" id="humidity">--- % RH</label>
				</div>
			</div>
			<div style="float:left; display:inline-block;width:33%">
				<div style="float:left">
					<img height="32px" width="32px" src="<%=request.getContextPath()%>/images/wind.png"/>
				</div>
				<div class="weather_condition_value">
					<label class="no_alarm" id="velocity">--- m/s</label>
				</div>
			</div>
			<div style="float:left; display:inline-block;width:33%">
				<div style="float:left">
					<img height="32px" width="32px" src="<%=request.getContextPath()%>/images/temperature.png"/>
				</div>
				<div class="weather_condition_value">
					<label class="no_alarm" id="temperature">--- Deg. M</label>
				</div>
			</div>
		</div>
	</div>
	<div class="image_carousel">
		<div id="foo2">
	<!-- 
		 <a rel="prettyPhoto[caroufredsel]" href="http://altamira.asu.cas.cz:8080/RTIDBRepository/FileServlet?uuid=000000070000000120131128000001429fdc95bdv001&format=JPG">
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" width="80px"/>
		 </a>	
		
		
		 <a rel="prettyPhoto[caroufredsel]" href="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg">
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg"  width="80px"/>
			</a>
			<a rel="prettyPhoto[caroufredsel]" href="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg">
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" width="80px"/>
			</a>
			<a rel="prettyPhoto[caroufredsel]" href="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg">
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" width="80px"/>
			</a>
			<a rel="prettyPhoto[caroufredsel]" href="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg">
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" width="80px"/>
			</a>
			<a rel="prettyPhoto[caroufredsel]" href="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg">
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg"  width="80px"/>
			</a>
			<a rel="prettyPhoto[caroufredsel]" href="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg">
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg"  width="80px"/>
			
			</a><a rel="prettyPhoto[caroufredsel]" href="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg">
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" width="80px"/>
			</a>
			<a rel="prettyPhoto[caroufredsel]" href="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg">
			<img src="<%=request.getContextPath()%>/images/nebulosa_tarantula.jpeg" width="80px"/>
			</a>  
			 -->
		</div>
		<div class="clearfix"></div>
		<a class="prev" id="foo1_prev" href="#"><span>prev</span></a>
		<a class="next" id="foo1_next" href="#"><span>next</span></a> 
	</div>
</div>

<script>
/*
$(function() {
    $( "#slider-range-min" ).slider({
      range: "min",
      value: 0,
      min: -500,
      max: 500,
      slide: function( event, ui ) {
        $( "#amount" ).text(ui.value);
      },
      stop: function(event,ui){
    	  GlAPI.setParameterTreeValue(<%= reservationId %>,'focuser','steps',(ui.value-focuserPosition),function(success){
				//TODO executar operación mover enfocador
				focuserPosition = ui.value;
			}, function(error){

			});
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );
  });
  */
/*$("#foo2").carouFredSel({
	circular: false,
	infinity: false,
	auto : false,
	responsive:true,
	items:4,
	prev : "#foo1_prev",
	next : "#foo1_next"
});*/
/*$("#foo2 a").prettyPhoto({
	theme: "facebook",
	changepicturecallback: function() {
		$("#foo2").trigger("pause");
	},
	callback: function() {
		$("#foo2").trigger("play");
	}
});*/
/*$("#foo1").carouFredSel({
	circular: false,
	infinity: false,
	auto : false,
	responsive:true,
	align:"center",
	items: 5,
	height:"auto",
	prev : "#foo1_prev",
	next : "#foo1_next"
});*/
$("#coords_ra").keyup('keyup', function(e){
	var text = $(this).val();
	if(text==""){
		if($("#coords_dec").val()==""){
			$("#tags").removeAttr("disabled");
		}
	} else {
		if($("#tags").val()==""){
			$("#tags").attr("disabled",true);	
		}
	}

});
$("#coords_dec").bind('keyup', function(e){
	if($(this).val()==""){
		if($("#coords_ra").val()==""){
			$("#tags").removeAttr("disabled");
		}
	} else {
		if($("#tags").val()==""){
			$("#tags").attr("disabled",true);	
		}
	}
});
$("#tags").bind('keyup', function(e){
	if($(this).val()==""){
		$("#coords_ra").removeAttr("disabled");
		$("#coords_dec").removeAttr("disabled");
	} else {
		if ($("#coords_ra").val()=="" && $("#coords_dec").val()==""){
			$("#coords_ra").attr("disabled",true);
			$("#coords_dec").attr("disabled",true);		
		}
	}
});

var dragged = false;
var initFocuserPosition = 0;
var finalFocuserPosition = 1000;
var currentFocuserPosition = 0;

$('#focus_marker').on('mouseenter', function(e){
	$('#focus_marker_info').text(currentFocuserPosition);
	$('#focus_marker_info').css("visibility","visible");
});

$('#focus_marker').on('mouseleave', function(e){
	if (!dragged){
		$('#focus_marker_info').css("visibility","hidden");		
	}
});

$('#focus_marker').on('mousedown', function(e){
		
		var movementDirection = 0;  //Undefined
		var lastRotateDegree = 0;
		var rotateDegree = 0;
		
		var limitClockwiseDirection = false;
		var limitCounterClockwiseDirection = false;
	
		dragged = true;
		
		$('#focus_marker').css("opacity","0.8");
	
		e.originalEvent.preventDefault();
		
        $(window).mousemove(function(event){
            var rotateOriginalDegree = rotateAnnotationCropper($('#main_image').parent(), event.pageX,event.pageY, $('#focus_marker'));
            
            if ((rotateOriginalDegree < 270) && (rotateOriginalDegree > 180)){
            	rotateDegree = rotateOriginalDegree - 360;
            } else {
            	rotateDegree = rotateOriginalDegree;
            }
            
            var rotate = 'rotate(' +rotateOriginalDegree + 'deg)';
			var rotateInfo = 'rotate(' +(-1)*rotateOriginalDegree + 'deg)';

			$('#focus_marker').css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
			$("#focus_marker_info").css({'-moz-transform': rotateInfo, 'transform' : rotateInfo, '-webkit-transform': rotateInfo, '-ms-transform': rotateInfo});
			     
             currentFocuserPosition = initFocuserPosition + parseInt(rotateDegree*((finalFocuserPosition - initFocuserPosition) / 180));
             $('#focus_marker_info').text(currentFocuserPosition);    
            
        });
        $(window).mouseup(function(event){ 
        	if (dragged){
        		
        		$(window).unbind('mousemove');
        		console.log("Moving focuser:"+$("#focus_marker_info").text());
        		
        		GlAPI.setParameterTreeValue(<%= reservationId %>,'focuser','position',currentFocuserPosition,function(success){

     			}, function(error){

     			});
        		$('#focus_marker').css("opacity","1.0");		
        		dragged = false;
        	}	
        });
        
    });                    
	
$("#ccd_alert").tooltip({
	show: {
		 effect: "slideDown",
	     delay: 250
	}
});


$("#ccd_button_0").click(function(){
	$("#ccd_button_0").attr("class", "ccd_button_selected");
	$("#ccd_button_1").attr("class", "ccd_button");
	$("#filter_selector").removeAttr("disabled");
	//setOrder(0);
});
$("#ccd_button_1").click(function(){
	$("#ccd_button_1").attr("class", "ccd_button_selected");
	$("#ccd_button_0").attr("class", "ccd_button");
	$("#filter_selector").attr("disabled",true);
	//setOrder(1);
});

$("#binning_selector").prop("selectedIndex",1);
</script>