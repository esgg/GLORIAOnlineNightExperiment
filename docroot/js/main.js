'use strict';

var expTimer;

function InitDevices(GloriaAPI, $scope){
	$scope.$watch('password', function () {
		GloriaAPI.setCredentials($scope.user, $scope.password);
		console.log($scope.password); 
		GloriaAPI.executeOperation(167,'get_filters', function(success){
			GetFilters(GloriaAPI, $scope, 167);
			$("#load_init").remove();
		}, function(error){
			alert(error);
		});
		GloriaAPI.executeOperation(167,'get_ccd_attributes', function(success){
			
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
			expTimer = setInterval(function(){exposureTimer(GloriaAPI, $scope, cid);},2000);
		}, function(error){
			alert(error);
		});		
	}, function(error){
		alert(error);
	});
}

function StartExposure(GloriaAPI, Sequence, data){
	return Sequence(function() {
		return GloriaAPI.executeOperation(data.reservation,'start_exposure',function(success){
			GloriaAPI.getParameterTreeValue(data.reservation,'cameras','ccd.images.[0].inst.id',function(success){
				if (success != -1){
					console.log("Image with id "+success+" generated");
					expTimer = setInterval(function(){exposureTimer(GloriaAPI, data);},2000);
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
		return GloriaAPI.setParameterTreeValue(data.reservation,'cameras','ccd.images.[0].exposure',parseFloat(data.exposure_time),function(success){
				
			}, function(error){
				$("#expose_0_button").prop("disabled",false);
			});
	});
}

function CcdDevice(GloriaAPI, Sequence, $scope){
	$scope.setFilter = function(){
		GloriaAPI.setParameterTreeValue($scope.reservation,'fw','selected',$scope.filter,function(success){

		}, function(error){
			
		});
	};
	
	$scope.expose = function(){
		//$("<img src=\"../images/nebulosa_tarantula.jpeg\" height=\"80px\" width=\"80px\"/>").appendTo("#foo1");
//		$("#foo1").carouFredSel({
//			circular: false,
//			infinity: false,
//			auto : false,
//			items: 4,
//			prev : "#foo1_prev",
//			next : "#foo1_next"
//		});
		if (!isNaN($scope.exposure_time) && ($scope.exposure_time>0) && ($scope.exposure_time<=120)){
			$("#expose_0_button").prop("disabled",true);
			$("#loading").css("visibility","visible");
			$scope.status_main_ccd = "EXPOSING";
			console.log("start exposition");
			SetExposureTime(GloriaAPI, Sequence, $scope);
			console.log("start exposition");
			SetCCDAttributes(GloriaAPI, Sequence, $scope);
			StartExposure(GloriaAPI, Sequence, $scope);
//			$scope.status_main_ccd = "EXPOSING";
//			GloriaAPI.setParameterTreeValue(167,'cameras','ccd.images.[0].exposure',$scope.exposure_time,function(success){
//				Expose(GloriaAPI, $scope, 167);
//			}, function(error){
//				
//			});
		} else {
			alert("Wrong parameter exposure time (MIN:0, MAX:120)");
		}
		
	};
}

function GetCamerasCtrl(GloriaAPI, $scope){
	$scope.$watch('password', function () {
		GloriaAPI.setCredentials($scope.user,$scope.password);
		GloriaAPI.getParameterValue(167,'cameras',function(success){
				
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

function exposureTimer(GloriaAPI, $scope){
	GloriaAPI.executeOperation($scope.reservation,'load_image_urls',function(success){
		GloriaAPI.getParameterTreeValue($scope.reservation,'cameras','ccd.images.[0].inst',function(success){
			alert("URL:"+success.jpg);
			if (success.jpg!=null){
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
				$scope.status_main_ccd = "IMAGE TAKEN";
				$("<img src=\""+mImage.src+"\" height=\"80px\" width=\"80px\"/>").appendTo("#foo1");
				console.log("Deleting timer");
				clearInterval(expTimer);
				
				
				$("#foo1").carouFredSel({
					circular: false,
					infinity: false,
					auto : false,
					items: 4,
					height:80,
					prev : "#foo1_prev",
					next : "#foo1_next"
				});
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