'use strict';

var expTimer;
var numImages=0;
var ccdOrder=0;
var GlAPI;
var focuserPosition=0;

function InitDevices(GloriaAPI, $scope){
	GlAPI = GloriaAPI;
	$scope.$watch('password', function () {
		//alert("Reservation:"+$scope.reservation);
		GloriaAPI.setCredentials($scope.user, $scope.password);
		console.log($scope.password); 
		GloriaAPI.executeOperation($scope.reservation,'get_filters', function(success){
			GetFilters(GloriaAPI, $scope, $scope.reservation);
			$("#load_init").remove();
		}, function(dataError, statusError){
			if(statusError == 401){
				$("#loading_message").text("You are not authenticated in the system");		
			} else {
				alert("Unknown Error:"+statusError);
			}

		});
		GloriaAPI.executeOperation($scope.reservation,'get_ccd_attributes', function(success){
			
		}, function(error){
			alert(error);
		});
	});
}

function GetFilters(GloriaAPI, $scope, cid){
	GloriaAPI.getParameterValue(cid, 'fw', function(success){
		$scope.filters_0 = success.filters;
	}, function(error){
		alert(error);
	});
	
}

function Expose(GloriaAPI, $scope, cid){
	GloriaAPI.executeOperation(167,'set_ccd_attributes',function(success){
		GloriaAPI.executeOperation(167,'start_exposure',function(success){
			console.log("Borrar");
			expTimer = setInterval(function(){exposureTimer(GloriaAPI, $scope, cid);},5000);
		}, function(error){
			alert(error);
		});		
	}, function(error){
		alert(error);
	});
}

function StartExposure(GloriaAPI, Sequence, data, $timeout){
	return Sequence(function() {
		return GloriaAPI.executeOperation(data.reservation,'start_exposure',function(success){
			GloriaAPI.getParameterTreeValue(data.reservation,'cameras','ccd.images.['+ccdOrder+'].inst.id',function(success){
				if (success != -1){
					console.log("Image with id "+success+" generated");
					
					data.timer = $timeout(function() {exposureTimer(GloriaAPI, data, $timeout);}, 1000, 1000);
					
					
					//expTimer = setInterval(function(){exposureTimer(GloriaAPI, data);},2000);
				}
			}, function(error){
				$("#expose_0_button").prop("disabled",false);
			});
				
				
			}, function(error){
				$("#expose_0_button").prop("disabled",false);
			});
	});
}

function SetCCDAttributes(GloriaAPI, Sequence, data){
	return Sequence(function() {
		return GloriaAPI.executeOperation(data.reservation,'set_ccd_attributes',function(success){
				
			}, function(error){
				$("#expose_0_button").prop("disabled",false);
			});
	});
}


function SetExposureTime(GloriaAPI, Sequence, data){
	return Sequence(function() {
		return GloriaAPI.setParameterTreeValue(data.reservation,'cameras','ccd.images.['+ccdOrder+'].exposure',parseFloat(data.exposure_time),function(success){
				
			}, function(error){
				$("#expose_0_button").prop("disabled",false);
			});
	});
}

function MountDevice(GloriaAPI, Sequence, $scope){
	
	$scope.go = function(){
		console.log($scope.ra);
		var raRegularExpr = new RegExp(/^[-]?[0-9]+.[0-9]+$/);
		var decRegularExpr = new RegExp(/^[-]?[0-9]+.[0-9]+$/);
		var ra_value = $("#coords_ra").val();
		var dec_value = $("#coords_dec").val();
		
		if ($("#tags").val() == ""){	//Check if this field is empty
			if ((ra_value.match(raRegularExpr)) && (ra_value>=0) && (ra_value<360)){
					if ((dec_value.match(decRegularExpr) && (dec_value>=-90) && (dec_value<=90))){
						//Execute go operation
						alert("Go");
					} else {
						alert("Wrong dec value (MIN:-90, MAX:90)");
					}
			}  else {
				alert("Wrong ra value (MIN:0, MAX:360 not incluided)");
			}	
		} else {
			//Execute go operation
			alert("Go");
		}
		
	};
}

function drawWeatherConditions(GloriaAPI, $scope, $timeout){
	console.log("Paso de estacion");
	GloriaAPI.executeOperation($scope.reservation,'load_weather_values',function(success){
		GloriaAPI.getParameterValue($scope.reservation,'weather',function(weather){
			$("#velocity").text(Math.round(weather.wind.value)+" m/s");
			$("#humidity").text(Math.round(weather.rh.value)+" % RH");
			$("#temperature").text(Math.round(weather.temperature.value)+" Deg.");
		}, function(error){

		});
	}, function(error){

	});
	$scope.weatherTimer = $timeout(function() {
		drawWeatherConditions(GloriaAPI, $scope, $timeout);
	}, 10000);
}

function WeatherDevice(GloriaAPI, $scope, $timeout){
	$scope.weatherTimer = $timeout(function() {
			drawWeatherConditions(GloriaAPI, $scope, $timeout);
		}, 10000);
	
}

function CcdDevice(GloriaAPI, Sequence, $scope, $timeout){
	
	
	
	$scope.setFilter = function(){
		GloriaAPI.setParameterTreeValue($scope.reservation,'fw','selected',$scope.filter,function(success){
			
		}, function(error){
			
		});
	};
	
	$scope.setOrder = function(order) {
		if (order == 0){
			$("#ccd_button_0").attr("class", "ccd_button_selected");
			$("#ccd_button_1").attr("class", "ccd_button");
			//$("#filter_selector").removeAttr("disabled");
		} else if (order == 1){
			$("#ccd_button_1").attr("class", "ccd_button_selected");
			$("#ccd_button_0").attr("class", "ccd_button");
			//$("#filter_selector").attr("disabled",true);
		}
		GloriaAPI.setParameterTreeValue($scope.reservation,'cameras','ccd.order',parseInt(order),function(success){
			ccdOrder = parseInt(order);
		}, function(error){
			
		});
	};
	
	$scope.expose = function(){

		if (!isNaN($scope.exposure_time) && ($scope.exposure_time>0) && ($scope.exposure_time<=120)){
			$("#expose_0_button").prop("disabled",true);
			$("#loading").css("visibility","visible");
			$("#ccd_status").addClass("mess-info");
			$scope.status_main_ccd = "EXPOSING";
			console.log("start exposition");
			SetExposureTime(GloriaAPI, Sequence, $scope);
			SetCCDAttributes(GloriaAPI, Sequence, $scope);
			StartExposure(GloriaAPI, Sequence, $scope, $timeout);
		} else {
			alert("Wrong parameter exposure time (MIN:0, MAX:120)");
		}
		
	};
}

function GetCamerasCtrl(GloriaAPI, $scope){
	$scope.$watch('password', function () {
		GloriaAPI.setCredentials($scope.user,$scope.password);
		GloriaAPI.getParameterValue($scope.reservation,'cameras',function(success){
				
				for (var nscam=0;nscam<success.scam.number;nscam++){
					
					var scamCode = "<div style=\"margin-top:"+80+"px;\">" +
							"<div style=\"width:100px;text-align:center;\"><span class=\"title\">"+success.scam.images[nscam].name+"</span></div>" +
							"<div class=\"expand\" style=\"z-index:"+(500-nscam)+";\">" +
							"<div class=\"positioner\">" +
							"<a class=\"slide\" aria-haspopup=\"true\">";
					scamCode = scamCode + "<img src=\""+success.scam.images[nscam].url+"\"/>";
					scamCode = scamCode + "</a></div></div></div>";
					
					$("#surveillance_panel").append(scamCode);	
				}
				
			}, function(error){
					alert(error);
					});
	});
}

function exposureTimer(GloriaAPI, data, $timeout){

	console.log("Paso del timer");
	GloriaAPI.executeOperation(data.reservation,'load_image_urls',function(success){
		GloriaAPI.getParameterTreeValue(data.reservation,'cameras','ccd.images.['+ccdOrder+'].inst',function(success){
			if (success.jpg!=null){
		
				console.log("Deleting timer");
				//clearInterval(expTimer);
				var mImage = new Image();
				mImage.src = success.jpg;
				mImage.onload = function(e){
					var yFactor = mImage.height/480;
					var imageWidth = mImage.width/yFactor;
					var shift = (480-imageWidth)/2;
					$("#image_0").attr("src",success.jpg);
					$("#image_0").load(function (e){
						$("#main_image_container").css("margin-left",shift);
						$("#loading").css("visibility","hidden");
						$("#expose_0_button").prop("disabled",false);
					});
				};
				data.status_main_ccd = "IMAGE TAKEN";
				$("#ccd_status").removeClass("mess-info");
				var htmlCode = "<a rel=\"prettyPhoto[caroufredsel]\" href=\""+mImage.src+"\" style=\"width:235px\">";
				htmlCode = htmlCode + "<img src=\""+mImage.src+"\"/></a>";
				$(htmlCode).appendTo("#foo2");
				//$("<img src=\""+mImage.src+"\" height=\"80px\" width=\"80px\"/>").appendTo("#foo2");
				//$(" <a rel=\"prettyPhoto[caroufredsel]\" href=\""+mImage.src+"\"<img src=\""+mImage.src+"\" height=\"80px\" width=\"80px\"/></a>").appendTo("#foo2");
				numImages++;
				if (numImages>4){
					$("#foo2").carouFredSel({
						circular: false,
						infinity: false,
						auto : false,
						responsive:true,
						items:4,
						width:"variable",
						prev : "#foo1_prev",
						next : "#foo1_next"
					});			
				}
				$("#foo2 a").prettyPhoto({
					theme: "facebook",
					changepicturecallback: function() {
						$("#foo2").trigger("pause");
					},
					callback: function() {
						$("#foo2").trigger("play");
					}
				});
				/*$("#foo2 a").css("width",235);*/
			}else{
				console.log("Launching timer again");
				data.timer = $timeout(function() {exposureTimer(GloriaAPI, data, $timeout);}, 1000);
			}
		}, function(error){
			$("#expose_0_button").prop("disabled",false);
		});
	}, function(error){
		alert(error);
		$("#expose_0_button").prop("disabled",false);
	});
					
	
}

function startAnimation(){
	document.getElementById('images_gallery').className ='images_animation';
}

function setOrder(order){
	console.log("Order:"+order);
	if (order == 0){
		console.log("Paso 0");
		$("#ccd_button_0").attr("class", "ccd_button_selected");
		$("#ccd_button_1").attr("class", "ccd_button");
		//$("filter_selector").removeAttr("disabled");
	} else if (order == 1){
		console.log("Paso 1");
		$("#ccd_button_1").attr("class", "ccd_button_selected");
		$("#ccd_button_0").attr("class", "ccd_button");
		//$("filter_selector").attr("disabled",true);
	}
	console.log("Paso");
	GloriaAPI.setParameterTreeValue(data.reservation,'cameras','ccd.order',order,function(success){
		
	}, function(error){
		
	});
}