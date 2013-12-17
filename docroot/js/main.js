'use strict';

var expTimer;
var numImages=0;
var ccdOrder=0;
var GlAPI;
var focuserPosition=0;
var max_ccd_timer=5;
var num_ccd_timer=max_ccd_timer;

function InitDevices(GloriaAPI, $scope){
	GlAPI = GloriaAPI;
	$scope.$watch('password', function () {
		GloriaAPI.setCredentials($scope.user, $scope.password);
		console.log($scope.password); 
		GloriaAPI.executeOperation($scope.reservation,'get_filters', function(success){
			GetFilters(GloriaAPI, $scope, $scope.reservation);
			$("#load_init").remove();
		}, function(dataError, statusError){
			if(statusError == 401){
				$("#init_image").remove();
				$("#loading_message").text("Sign in the system");		
			} else if (statusError == 404){
				$("#init_image").remove();
				$("#loading_message").text("No reservation id specified");
			} else if (statusError == 0){
				$("#init_image").remove();
				$("#loading_message").text("No communication with the server");
			} else {
				alert("Unknown Error:"+statusError+";"+dataError);
			}

		});
		GloriaAPI.executeOperation($scope.reservation,'get_ccd_attributes', function(success){
			
		}, function(error){
			//alert(error);
		});
		GloriaAPI.getImagesByContext($scope.reservation,function(success){
			 $.each(success, function(i, image){ //Iterate among all images generate previously
					var htmlCode = "<a rel=\"prettyPhoto[caroufredsel]\" href=\""+image.jpg+"\" style=\"width:235px\">";
					htmlCode = htmlCode + "<img src=\""+image.jpg+"\"/></a>";
					$(htmlCode).appendTo("#foo2");
					numImages++;
					
		            console.log(image.jpg);
		        });
			 
			 //If number of  images is greater than 4, apply carousel effect
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
			 	//If the number of images is greater than 0, apply pretty effect
			 	if (numImages>0){
					$("#foo2 a").prettyPhoto({
						theme: "facebook",
						changepicturecallback: function() {
							$("#foo2").trigger("pause");
						},
						callback: function() {
							$("#foo2").trigger("play");
						}
					});			 		
			 	}
			
		}, function(error){
			
		});
		GloriaAPI.getParameterTreeValue($scope.reservation,'focuser','position',function(success){
			console.log("Initial position:"+success);
		}, function(dataError,statusError){

		});
	});
 
}

function GetFilters(GloriaAPI, $scope, cid){
	GloriaAPI.getParameterValue(cid, 'fw', function(success){
		$scope.filters_0 = success.filters;
		$scope.filter = success.filters[0];
		GloriaAPI.setParameterTreeValue($scope.reservation,'fw','selected',$scope.filter,function(success){
			
		}, function(error){
			
		});
	}, function(error){
		//alert(error);
	});
	
}
/*
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
*/
function StartExposure(GloriaAPI, Sequence, data, $timeout){
	return Sequence(function() {
		return GloriaAPI.executeOperation(data.reservation,'start_exposure',function(success){
			GloriaAPI.getParameterTreeValue(data.reservation,'cameras','ccd.images.['+ccdOrder+'].inst.id',function(success){
				if (success != -1){
					console.log("Image with id "+success+" generated");
					
					data.timer = $timeout(function() {exposureTimer(GloriaAPI, data, $timeout);}, parseInt(data.exposure_time*1000));
					
				} else {
					$("#ccd_budge").text("1");
					$("#ccd_budge").css("visibility","visible");
					$("#ccd_alert").attr("title","No image id generated");
					data.status_main_ccd = "ERROR";
				}
			}, function(error){
				$("#expose_0_button").removeAttr("disabled");
				data.status_main_ccd = "ERROR";
				$("#ccd_budge").text("1");
				$("#ccd_budge").css("visibility","visible");
				$("#ccd_alert").attr("title","Error in service");
			});
				
				
			}, function(error){
				$("#expose_0_button").removeAttr("disabled");
				data.status_main_ccd = "ERROR";
				$("#ccd_budge").text("1");
				$("#ccd_budge").css("visibility","visible");
				$("#ccd_alert").attr("title","Impossible to execute operation");
			});
	});
}

function SetCCDAttributes(GloriaAPI, Sequence, data){
	return Sequence(function() {
		return GloriaAPI.executeOperation(data.reservation,'set_ccd_attributes',function(success){
				
			}, function(error){
				$("#expose_0_button").removeAttr("disabled");
			});
	});
}


function SetExposureTime(GloriaAPI, Sequence, data){
	return Sequence(function() {
		return GloriaAPI.setParameterTreeValue(data.reservation,'cameras','ccd.images.['+ccdOrder+'].exposure',parseFloat(data.exposure_time),function(success){
				
			}, function(error){
				$("#expose_0_button").removeAttr("disabled");
			});
	});
}

function SetTargetName(GloriaAPI, Sequence, $scope){
	
	return Sequence(function() {
		return GloriaAPI.setParameterTreeValue($scope.reservation,'mount','target.object',$("#tags").val(),function(success){
			
		}, function(error){
			
		});
	});
	
}

function SetRADEC(GloriaAPI, Sequence, $scope){
	var coordinates = new Object();
	coordinates.ra = $("#coords_ra").val();
	coordinates.dec = $("#coords_dec").val();
	
	return Sequence(function() {
		return GloriaAPI.setParameterTreeValue($scope.reservation,'mount','target.coordinates',coordinates,function(success){
			
		}, function(error){
			
		});
	});
	
}

function MountDevice(GloriaAPI, Sequence, $scope){
	
	$scope.go = function(){

		var raRegularExpr = new RegExp(/^[-]?[0-9]+.[0-9]+$/);
		var decRegularExpr = new RegExp(/^[-]?[0-9]+.[0-9]+$/);
		var ra_value = $("#coords_ra").val();
		var dec_value = $("#coords_dec").val();
		
		if ($("#tags").val() == ""){	//Check if this field is empty
			if ((ra_value.match(raRegularExpr)) && (ra_value>=0) && (ra_value<360)){
					if ((dec_value.match(decRegularExpr) && (dec_value>=-90) && (dec_value<=90))){
						//Set radec
						SetRADEC(GloriaAPI, Sequence, $scope);
						//Execute go operation
						
						
					} else {
						alert("Wrong dec value (MIN:-90, MAX:90)");
					}
			}  else {
				alert("Wrong ra value (MIN:0, MAX:360 not incluided)");
			}	
		} else {
			//Set target name
			SetTargetName(GloriaAPI, Sequence, $scope);
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
			$("#expose_0_button").attr("disabled",true);
			$("#loading").css("visibility","visible");
			$("#ccd_status").addClass("mess-info");
			$scope.status_main_ccd = "EXPOSING";
			num_ccd_timer=max_ccd_timer;
			console.log("set exposure time");
			SetExposureTime(GloriaAPI, Sequence, $scope);
			console.log("set ccd attributes");
			SetCCDAttributes(GloriaAPI, Sequence, $scope);
			console.log("start exposure");
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
	data.status_main_ccd = "TRANSFERING";
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
						$("#expose_0_button").removeAttr("disabled");
						
					});
				};
				data.status_main_ccd = "IMAGE TAKEN";
				$("#ccd_status").removeClass("mess-info");
				var htmlCode = "<a rel=\"prettyPhoto[caroufredsel]\" href=\""+mImage.src+"\" style=\"width:235px\">";
				htmlCode = htmlCode + "<img src=\""+mImage.src+"\"/></a>";
				$(htmlCode).appendTo("#foo2");
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
				if (num_ccd_timer == 0){
					data.status_main_ccd = "ERROR";	
				} else {
					num_ccd_timer--;
					data.timer = $timeout(function() {exposureTimer(GloriaAPI, data, $timeout);}, 1000);
				}

			}
		}, function(error){
			$("#expose_0_button").removeAttr("disabled");
			data.status_main_ccd = "ERROR TAKING IMAGE";
		});
	}, function(error){
		alert(error);
		$("#expose_0_button").removeAttr("disabled");
		data.status_main_ccd = "ERROR TAKING IMAGE";
	});
						
}

function startAnimation(){
	document.getElementById('images_gallery').className ='images_animation';
}

function setOrder(order){
	if (order == 0){
		$("#ccd_button_0").attr("class", "ccd_button_selected");
		$("#ccd_button_1").attr("class", "ccd_button");
		//$("filter_selector").removeAttr("disabled");
	} else if (order == 1){
		$("#ccd_button_1").attr("class", "ccd_button_selected");
		$("#ccd_button_0").attr("class", "ccd_button");
		//$("filter_selector").attr("disabled",true);
	}
	console.log("Paso");
	GloriaAPI.setParameterTreeValue(data.reservation,'cameras','ccd.order',order,function(success){
		
	}, function(error){
		
	});
}

function rotateAnnotationCropper(offsetSelector, xCoordinate, yCoordinate, cropper){
    //alert(offsetSelector.left);
    var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width()/2;
    var y = -1*(yCoordinate - offsetSelector.offset().top - offsetSelector.height()/2);
    var theta = Math.atan2(y,x)*(180/Math.PI);        


    var cssDegs = convertThetaToCssDegs(theta);
    
    /*
    var rotate = 'rotate(' +cssDegs + 'deg)';
    var rotateInfo = 'rotate(' +(-1)*cssDegs + 'deg)';
    if (cssDegs < 180){
        cropper.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
        $("#focus_marker_info").css({'-moz-transform': rotateInfo, 'transform' : rotateInfo, '-webkit-transform': rotateInfo, '-ms-transform': rotateInfo});
    	
    }
    */
    return cssDegs;   
}

function convertThetaToCssDegs(theta){
	var cssDegs = 90 - theta;
	return cssDegs;
}
