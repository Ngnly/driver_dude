var mwApp = angular.module("driver_dude.controllers", [])



// TODO: indexCtrl --|-- 
.controller("indexCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	$scope.$on("$ionicView.enter", function (){
		$scope.scrollTop();
	});
	// TODO: indexCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$ionicScrollDelegate.$getByHandle("top").scrollTop();
	};
	// TODO: indexCtrl --|-- $scope.openURL
	// open external browser 
	$scope.openURL = function($url){
		window.open($url,"_system","location=yes");
	};
	// TODO: indexCtrl --|-- $scope.openAppBrowser
	// open AppBrowser
	$scope.openAppBrowser = function($url){
		window.open($url,"_blank","hardwareback=Done");
	};
	// TODO: indexCtrl --|-- $scope.openWebView
	// open WebView
	$scope.openWebView = function($url){
		window.open($url,"_self");
	};
	
	// TODO: indexCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: indexCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `index` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: side_menusCtrl --|-- 
.controller("side_menusCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,localStorageService,ngToast,$firebaseObject, $firebaseAuth, Auth, FURL, Utils){
	var ref = firebase.database().ref();
	$scope.authObj = $firebaseAuth();

	$scope.logOut = function () {
		Auth.logout();
		$location.path("/login");
	}
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	$scope.$on("$ionicView.enter", function (){
		$scope.scrollTop();
	});
	// TODO: side_menusCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$ionicScrollDelegate.$getByHandle("top").scrollTop();
	};
	// TODO: side_menusCtrl --|-- $scope.openURL
	// open external browser 
	$scope.openURL = function($url){
		window.open($url,"_system","location=yes");
	};
	// TODO: side_menusCtrl --|-- $scope.openAppBrowser
	// open AppBrowser
	$scope.openAppBrowser = function($url){
		window.open($url,"_blank","hardwareback=Done");
	};
	// TODO: side_menusCtrl --|-- $scope.openWebView
	// open WebView
	$scope.openWebView = function($url){
		window.open($url,"_self");
	};
	
	// TODO: side_menusCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	$scope.changeRoutes = function() {

		$scope.rData={};
		$scope.rData.route_id = parseInt(localStorageService.get('route_id'));

		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			template: '<input type="number" ng-model="rData.route_id">',
			title: 'Enter Route ID',
			subTitle: '',
			scope: $scope,
			buttons: [
				{ text: 'Cancel' },
				{
					text: '<b>Update</b>',
					type: 'button-positive',
					onTap: function(e) {
						if (!$scope.rData.route_id) {
							//don't allow the user to close unless he enters wifi password
							e.preventDefault();
						} else {
							return $scope.rData.route_id;
						}
					}
				}
			]
		});

		myPopup.then(function(res) {
			ngToast.success('Route Updated to ' +res);

			localStorageService.remove('stops','routeOverview');
			localStorageService.set('route_id',res);
			$state.go('driver_dude.dashboard');

		});


	};
	var popover_template = "";
	popover_template += "<ion-popover-view class=\"fit\">";
	popover_template += "	<ion-content>";
	popover_template += "		<ion-list>";
	popover_template += "			<a  class=\"item dark-ink\" ng-href=\"#/driver_dude/chat\" ng-click=\"popover.hide();doRefresh();\">";
	popover_template += "			Refresh Route";
	popover_template += "			</a>";
	popover_template += "		</ion-list>";
	popover_template += "	</ion-content>";
	popover_template += "</ion-popover-view>";
	
	
	$scope.popover = $ionicPopover.fromTemplate(popover_template,{
		scope: $scope
	});
	
	$scope.closePopover = function(){
		$scope.popover.hide();
	};
	
	$scope.$on("$destroy", function(){
		$scope.popover.remove();
	});

	// TODO: side_menusCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `side_menus` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: aboutCtrl --|-- 
.controller("aboutCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "menu" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	$scope.$on("$ionicView.enter", function (){
		$scope.scrollTop();
	});
	// TODO: aboutCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$ionicScrollDelegate.$getByHandle("top").scrollTop();
	};
	// TODO: aboutCtrl --|-- $scope.openURL
	// open external browser 
	$scope.openURL = function($url){
		window.open($url,"_system","location=yes");
	};
	// TODO: aboutCtrl --|-- $scope.openAppBrowser
	// open AppBrowser
	$scope.openAppBrowser = function($url){
		window.open($url,"_blank","hardwareback=Done");
	};
	// TODO: aboutCtrl --|-- $scope.openWebView
	// open WebView
	$scope.openWebView = function($url){
		window.open($url,"_self");
	};
	
	// TODO: aboutCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: aboutCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `about` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: chatCtrl --|-- 
.controller("chatCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "menu" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	$scope.$on("$ionicView.enter", function (){
		$scope.scrollTop();
	});
	// TODO: chatCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$ionicScrollDelegate.$getByHandle("top").scrollTop();
	};
	// TODO: chatCtrl --|-- $scope.openURL
	// open external browser 
	$scope.openURL = function($url){
		window.open($url,"_system","location=yes");
	};
	// TODO: chatCtrl --|-- $scope.openAppBrowser
	// open AppBrowser
	$scope.openAppBrowser = function($url){
		window.open($url,"_blank","hardwareback=Done");
	};
	// TODO: chatCtrl --|-- $scope.openWebView
	// open WebView
	$scope.openWebView = function($url){
		window.open($url,"_self");
	};
	
	// TODO: chatCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: chatCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `chat` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: dashboardCtrl --|-- 
.controller("dashboardCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,localStorageService){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "menu" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	$scope.$on("$ionicView.enter", function (){
		$scope.scrollTop();
	});
	// TODO: dashboardCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$ionicScrollDelegate.$getByHandle("top").scrollTop();
	};
	// TODO: dashboardCtrl --|-- $scope.openURL
	// open external browser 
	$scope.openURL = function($url){
		window.open($url,"_system","location=yes");
	};
	// TODO: dashboardCtrl --|-- $scope.openAppBrowser
	// open AppBrowser
	$scope.openAppBrowser = function($url){
		window.open($url,"_blank","hardwareback=Done");
	};
	// TODO: dashboardCtrl --|-- $scope.openWebView
	// open WebView
	$scope.openWebView = function($url){
		window.open($url,"_self");
	};
	
	// TODO: dashboardCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: dashboardCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `dashboard` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: form_pre_check_formCtrl --|-- 
.controller("form_pre_check_formCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "forms" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	$scope.$on("$ionicView.enter", function (){
		$scope.scrollTop();
	});
	// TODO: form_pre_check_formCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$ionicScrollDelegate.$getByHandle("top").scrollTop();
	};
	// TODO: form_pre_check_formCtrl --|-- $scope.openURL
	// open external browser 
	$scope.openURL = function($url){
		window.open($url,"_system","location=yes");
	};
	// TODO: form_pre_check_formCtrl --|-- $scope.openAppBrowser
	// open AppBrowser
	$scope.openAppBrowser = function($url){
		window.open($url,"_blank","hardwareback=Done");
	};
	// TODO: form_pre_check_formCtrl --|-- $scope.openWebView
	// open WebView
	$scope.openWebView = function($url){
		window.open($url,"_self");
	};
	
	// TODO: form_pre_check_formCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	
	// Form Request
	//pre_check_form
	$scope.form_pre_check_form= {};
	// TODO: form_pre_check_formCtrl --|-- $scope.submitPre_check_form
	$scope.submitPre_check_form = function(){
		// animation loading 
		$ionicLoading.show({
			template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
		});
	
		var $messages, $title = null;
		$http({
				method:"POST",
				url: "http://mwls.mymobiledesigner.com/api2/index.php?form=precheckform&json=submit",
				data: $httpParamSerializer($scope.form_pre_check_form),  // pass in data as strings
				headers: {"Content-Type":"application/x-www-form-urlencoded"}  // set the headers so angular passing info as form data (not request payload)
			})
			.then(function(response) {
				$messages = response.data.message;
				$title = response.data.title;
			},function(response){
				$messages = response.statusText;
				$title = response.status;
			}).finally(function(){
				// event done, hidden animation loading
				$timeout(function() {
					$ionicLoading.hide();
					if($messages !== null){
						// message
					var alertPopup = $ionicPopup.alert({
						title: $title,
						template: $messages,
					});
						// clear input
						$scope.form_pre_check_form.truck_id = "";
						$scope.form_pre_check_form.mileage = "";
						$scope.form_pre_check_form.checked = "";
					}
			}, 500);
		});
	};
	// code 

	// TODO: form_pre_check_formCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$scope.notSorted = function(obj) {
				if (!obj) {
					return [];
				}
				return Object.keys(obj);
			};
			$scope.checklistItems = [

				{'key':'parkingBrakes', 'text': "Parking Brakes"},
				{'key':'serviceBrakes', 'text': "service Brakes"},
				{'key':'headLights', 'text': "head Lights"},
				{'key':'tailLights', 'text': "tail Lights"},
				{'key':'tailSignals', 'text': "tail Signals"},
				{'key':'Reflectors', 'text': "Reflectors"},
				{'key':'Mirrors', 'text': "Mirrors"},
				{'key':'dashLights', 'text': "dashLights"},
				{'key':'instrumentsGauges', 'text': "instruments & Gauges"},
				{'key':'windowWindshield', 'text': "windowWindshield"},
				{'key':'seatBelts', 'text': "Seat Belts"},
				{'key':'registrationInsurance', 'text' :"Registration & Insurance"}
			];
			$scope.checklistItemsOptional = [
				{'key':'heaterDefroster', 'text':"Heater/Defroster"},
				{'key':'doors', 'text':"Doors"},
				{'key':'fluidLevels', 'text':"Fluid Levels"},
				{'key':'vehicleBodyDamage', 'text':"Vehicle Body Damage"},
				{'key':'mudFlaps', 'text':"Mud Flaps"},
				{'key':'enginePerformance', 'text':"Engine Performance"},
				{'key':'strapsETrack', 'text':"Straps/E-Track"}
				];
			
		} catch(e){
			console.log("%cerror: %cPage: `form_pre_check_form` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: formsCtrl --|-- 
.controller("formsCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "menu" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	$scope.$on("$ionicView.enter", function (){
		$scope.scrollTop();
	});
	// TODO: formsCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$ionicScrollDelegate.$getByHandle("top").scrollTop();
	};
	// TODO: formsCtrl --|-- $scope.openURL
	// open external browser 
	$scope.openURL = function($url){
		window.open($url,"_system","location=yes");
	};
	// TODO: formsCtrl --|-- $scope.openAppBrowser
	// open AppBrowser
	$scope.openAppBrowser = function($url){
		window.open($url,"_blank","hardwareback=Done");
	};
	// TODO: formsCtrl --|-- $scope.openWebView
	// open WebView
	$scope.openWebView = function($url){
		window.open($url,"_self");
	};
	
	// TODO: formsCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: formsCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `forms` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: loginCtrl --|-- 
.controller("loginCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,LoginService,localStorageService){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	$scope.$on("$ionicView.enter", function (){


	});
	// TODO: loginCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$ionicScrollDelegate.$getByHandle("top").scrollTop();
	};
	// TODO: loginCtrl --|-- $scope.openURL
	// open external browser 
	$scope.openURL = function($url){
		window.open($url,"_system","location=yes");
	};
	// TODO: loginCtrl --|-- $scope.openAppBrowser
	// open AppBrowser
	$scope.openAppBrowser = function($url){
		window.open($url,"_blank","hardwareback=Done");
	};
	// TODO: loginCtrl --|-- $scope.openWebView
	// open WebView
	$scope.openWebView = function($url){
		window.open($url,"_self");
	};
	
	// TODO: loginCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	$scope.user = {};
	$scope.user.username = 'user';
	$scope.user.password = 'secret';

	$scope.login = function() {
		LoginService.loginUser($scope.user.username, $scope.user.password).success(function(data) {
			$rootScope.routeID = $scope.user.route;
			localStorageService.set('route_id', $scope.user.route);
			localStorageService.set('user_id', 1);
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('driver_dude.dashboard');
		}).error(function(data) {
			var alertPopup = $ionicPopup.alert({
				title: 'Login failed!',
				template: 'Please check your credentials!'
			});
		});
	}
	// TODO: loginCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
//
//if (angular.isDefined($rootScope.user)) {
//    	$location.path('/mls_driver_2/dashboard');
//        }
// $rootScope.user = {};
//
//  $rootScope.login = function() {
//        console.log("LOGIN user: " + $rootScope.user.username + " - PW: " + $rootScope.user.password);
//      	$rootScope.user.name='Darrius';
//
//
//
//    	$location.path('/mls_driver_2/dashboard');
//    }


  
			
		} catch(e){
			console.log("%cerror: %cPage: `login` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();

})

.controller('ChatCtrl', function ($scope, Chats, $state) {
	//console.log("Chat Controller initialized");

	$scope.IM = {
		textMessage: ""
	};

	Chats.selectRoom($state.params.roomId);

	var roomName = Chats.getSelectedRoomName();

	// Fetching Chat Records only if a Room is Selected
	if (roomName) {
		$scope.roomName = " - " + roomName;
		$scope.chats = Chats.all();
	}

	$scope.sendMessage = function (msg) {
		console.log(msg);
		Chats.send($scope.displayName, msg);
		$scope.IM.textMessage = "";
	}

	$scope.remove = function (chat) {
		Chats.remove(chat);
	}
})

		.controller('RoomsCtrl', function ($scope, Rooms, Chats, $state) {
			//console.log("Rooms Controller initialized");
			$scope.rooms = Rooms.all();

			$scope.openChatRoom = function (roomId) {
				$state.go('tab.chat', {
					roomId: roomId
				});
			}
		})
// TODO: precheckCtrl --|-- 
.controller("precheckCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	$scope.$on("$ionicView.enter", function (){
		$scope.scrollTop();
	});
	// TODO: precheckCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$ionicScrollDelegate.$getByHandle("top").scrollTop();
	};
	// TODO: precheckCtrl --|-- $scope.openURL
	// open external browser 
	$scope.openURL = function($url){
		window.open($url,"_system","location=yes");
	};
	// TODO: precheckCtrl --|-- $scope.openAppBrowser
	// open AppBrowser
	$scope.openAppBrowser = function($url){
		window.open($url,"_blank","hardwareback=Done");
	};
	// TODO: precheckCtrl --|-- $scope.openWebView
	// open WebView
	$scope.openWebView = function($url){
		window.open($url,"_self");
	};
	
	// TODO: precheckCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: precheckCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `precheck` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: route_overviewCtrl --|-- 

// TODO: settingsCtrl --|-- 

