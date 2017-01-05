// TODO: --|---- directive
angular.module("driver_dude.services", [])


		// TODO: --|-------- sound-touch
.directive("soundTouch", function(){
	/** required: cordova-plugin-velda-devicefeedback **/
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("touchend", onTouchEnd);
			function onTouchEnd(event)
			{
				if (window.plugins && window.plugins.deviceFeedback){
					window.plugins.deviceFeedback.acoustic();
				}
			};
		}
	};
})
// TODO: --|-------- zoomTap
.directive("zoomTap", function($compile, $ionicGesture) {
	return {
		link: function($scope, $element, $attrs) {
			var zoom = minZoom = 10;
			var maxZoom = 50;
			$element.attr("style", "width:" + (zoom * 10) + "%");
			var handlePinch = function(e){
				if (e.gesture.scale <= 1) {
					zoom--;
				}else{
					zoom++;
				}
				if (zoom >= maxZoom) {
					zoom = maxZoom;
				}
				if (zoom <= minZoom) {
					zoom = minZoom;
				}
				$element.attr("style", "width:" + (zoom * 10) + "%");
			};
			var handleDoubleTap = function(e){
				zoom++;
				if (zoom == maxZoom) {
					zoom = minZoom;
				}
				$element.attr("style", "width:" + (zoom * 10) + "%");
			};
			var pinchGesture = $ionicGesture.on("pinch", handlePinch, $element);
			var doubletapGesture = $ionicGesture.on("doubletap", handleDoubleTap, $element);
			$scope.$on("$destroy", function() {
				$ionicGesture.off(pinchGesture, "pinch", $element);
				$ionicGesture.off(doubletapGesture, "doubletap", $element);
			});
		}
	};
})
// TODO: --|-------- zoom-view
.directive("zoomView", function($compile,$ionicModal, $ionicPlatform){
	return {
			link: function link($scope, $element, $attrs){
				
				$element.attr("ng-click", "showZoomView()");
				$element.removeAttr("zoom-view");
				$compile($element)($scope);
				$ionicPlatform.ready(function(){
					var zoomViewTemplate = "";
					zoomViewTemplate += "<ion-modal-view class=\"zoom-view\">";
					zoomViewTemplate += "<ion-header-bar class=\"bar bar-header light bar-balanced-900\">";
					zoomViewTemplate += "<div class=\"header-item title\"></div>";
					zoomViewTemplate += "<div class=\"buttons buttons-right header-item\"><span class=\"right-buttons\"><button ng-click=\"closeZoomView()\" class=\"button button-icon ion-close button-clear button-dark\"></button></span></div>";
					zoomViewTemplate += "</ion-header-bar>";
					zoomViewTemplate += "<ion-content>";
					zoomViewTemplate += "<ion-scroll zooming=\"true\" direction=\"xy\" style=\"width:100%;height:100%;position:absolute;top:0;bottom:0;left:0;right:0;\">";
					zoomViewTemplate += "<img ng-src=\"{{ngSrc}}\" style=\"width:100%!important;display:block;width:100%;height:auto;max-width:400px;max-height:700px;margin:auto;padding:10px;\"/>";
					zoomViewTemplate += "</ion-scroll>";
					zoomViewTemplate += "</ion-content>";
					zoomViewTemplate += "</ion-modal-view>";
					$scope.zoomViewModal = $ionicModal.fromTemplate(zoomViewTemplate,{
						scope: $scope,
						animation: "slide-in-up"
					});
					
					$scope.showZoomView = function(){
						$scope.zoomViewModal.show();
						$scope.ngSrc = $attrs.zoomSrc;
					};
					$scope.closeZoomView= function(){
						$scope.zoomViewModal.hide();
					};
				});
		}
	};
})
.directive("headerShrink", function($document){
	var fadeAmt;
	var shrink = function(header, content, amt, max){
		amt = Math.min(44, amt);
		fadeAmt = 1 - amt / 44;
		ionic.requestAnimationFrame(function(){
			var translate3d = "translate3d(0, -" + amt + "px, 0)";
			if(header==null){return;}
			for (var i = 0, j = header.children.length; i < j; i++){
			header.children[i].style.opacity = fadeAmt;
				header.children[i].style[ionic.CSS.TRANSFORM] = translate3d;
			}
		});
	};
	return {
		link: function($scope, $element, $attr){
			var starty = $scope.$eval($attr.headerShrink) || 0;
			var shrinkAmt;
			var header = $document[0].body.querySelector(".page-title");
			var headerHeight = $attr.offsetHeight || 44;
			$element.bind("scroll", function(e){
				var scrollTop = null;
				if (e.detail){
					scrollTop = e.detail.scrollTop;
				} else if (e.target){
					scrollTop = e.target.scrollTop;
				}
				if (scrollTop > starty){
					shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
					shrink(header, $element[0], shrinkAmt, headerHeight);
				}else{
					shrink(header, $element[0], 0, headerHeight);
				}
			});
			$scope.$parent.$on("$ionicView.leave", function (){
				shrink(header, $element[0], 0, headerHeight);
			});
			$scope.$parent.$on("$ionicView.enter", function (){
				shrink(header, $element[0], 0, headerHeight);
			});
		}
	}
})
// TODO: --|-------- fileread
.directive("fileread",function($ionicLoading,$timeout){
	return {
		scope:{
			fileread: "="
		},
		link: function(scope, element,attributes){
			element.bind("change", function(changeEvent) {
				$ionicLoading.show({
					template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
				});
				scope.fileread = "";
				var reader = new FileReader();
				reader.onload = function(loadEvent) {
					try{
						scope.$apply(function(){
							scope.fileread = loadEvent.target.result;
						});
					}catch(err){
						//alert(err.message);
					}
				}
				reader.onloadend = function(loadEvent) {
					try{
						$timeout(function(){
							$ionicLoading.hide();
								scope.fileread = loadEvent.target.result;
						},300);
					}catch(err){
						//alert(err.message);
					}
				}
				if(changeEvent.target.files[0]){
					reader.readAsDataURL(changeEvent.target.files[0]);
				}
				$timeout(function(){
					$ionicLoading.hide();
				},300)
			});
		}
	}
}) 
// TODO: --|-------- run-app-sms
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppSms", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var phoneNumber = $attrs.phone || "08123456789";
				var textMessage = window.encodeURIComponent($attrs.message) || "Hello";
				var urlSchema = "sms:" + phoneNumber + "?body=" + textMessage;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-call
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppCall", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var phoneNumber = $attrs.phone || "08123456789";
				var urlSchema = "tel:" + phoneNumber ;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-email
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppEmail", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var EmailAddr = $attrs.email || "info@ihsana.com";
				var textSubject = $attrs.subject || "";
				var textMessage = window.encodeURIComponent($attrs.message) || "";
				var urlSchema = "mailto:" + EmailAddr + "?subject=" + textSubject + "&body=" + textMessage;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-whatsapp
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppWhatsapp", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var textMessage = window.encodeURIComponent($attrs.message) || "";
				var urlSchema = "whatsapp://send?text=" + textMessage;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-line
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppLine", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var textMessage = window.encodeURIComponent($attrs.message) || "";
				var urlSchema = "line://msg/text/" + textMessage;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-twitter
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppTwitter", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var textMessage = window.encodeURIComponent($attrs.message) || "";
				var urlSchema = "twitter://post?message=" + textMessage;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-open-url
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runOpenURL", function(){
	/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var $href = $attrs.href || "http://ihsana.com/";
				window.open($href,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-browser
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppBrowser", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var $href = $attrs.href || "http://ihsana.com/";
				window.open($href,"_blank","closebuttoncaption=Done");
			};
		}
	};
})
// TODO: --|-------- run-webview
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runWebview", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var $href = $attrs.href || "http://ihsana.com/";
				window.open($href,"_self");
			};
		}
	};
})

		.service('LoginService', function($q) {
			return {
				loginUser: function(name, pw) {
					var deferred = $q.defer();
					var promise = deferred.promise;

					if (name == 'user' && pw == 'secret') {
						deferred.resolve('Welcome ' + name + '!');
					} else {
						deferred.reject('Wrong credentials.');
					}
					promise.success = function(fn) {
						promise.then(fn);
						return promise;
					}
					promise.error = function(fn) {
						promise.then(null, fn);
						return promise;
					}
					return promise;
				}
			}
		})

		.factory('GeoAlert', function() {
			console.log('GeoAlert service instantiated');
			var interval;
			var duration = 6000;
			var targetList;
			var processing = false;
			var callback;
			var minDistance = 10;

			// Credit: http://stackoverflow.com/a/27943/52160
			function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
				var R = 6371; // Radius of the earth in km
				var dLat = deg2rad(lat2-lat1);  // deg2rad below
				var dLon = deg2rad(lon2-lon1);
				var a =
								Math.sin(dLat/2) * Math.sin(dLat/2) +
								Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
								Math.sin(dLon/2) * Math.sin(dLon/2)
						;
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
				var d = R * c; // Distance in km
				return d;
			}

			function deg2rad(deg) {
				return deg * (Math.PI/180)
			}

			function hb() {
				console.log('hb running');
				if(processing) return;
				processing = true;
				navigator.geolocation.getCurrentPosition(function(position) {
					processing = false;
					console.log('my position',position.coords.latitude, position.coords.longitude);
					var closeTargets = [];
					targetList.forEach(function(target) {
						var dist = getDistanceFromLatLonInKm(target.lat, target.long, position.coords.latitude, position.coords.longitude);
						console.log("dist in km is "+dist);
						if(dist <= minDistance) closeTargets.push(target);

					});
					if(closeTargets.length > 0) callback(closeTargets);
				});
			}

			return {
				begin:function(targets,cb) {
					targetList = targets;
					callback = cb;
					interval = window.setInterval(hb, duration);
					hb();
				},
				end: function() {
					window.clearInterval(interval);
				},
				setTarget: function(lg,lt) {
					long = lg;
					lat = lt;
				}
			};

		})

		.factory('Chats', function ($firebase, Rooms) {

			var selectedRoomId;

			var ref = new Firebase(firebaseUrl);
			var chats;

			return {
				all: function () {
					return chats;
				},
				remove: function (chat) {
					chats.$remove(chat).then(function (ref) {
						ref.key() === chat.$id; // true item has been removed
					});
				},
				get: function (chatId) {
					for (var i = 0; i < chats.length; i++) {
						if (chats[i].id === parseInt(chatId)) {
							return chats[i];
						}
					}
					return null;
				},
				getSelectedRoomName: function () {
					var selectedRoom;
					if (selectedRoomId && selectedRoomId != null) {
						selectedRoom = Rooms.get(selectedRoomId);
						if (selectedRoom)
							return selectedRoom.name;
						else
							return null;
					} else
						return null;
				},
				selectRoom: function (roomId) {
					console.log("selecting the room with id: " + roomId);
					selectedRoomId = roomId;
					if (!isNaN(roomId)) {
						chats = $firebase(ref.child('rooms').child(selectedRoomId).child('chats')).$asArray();
					}
				},
				send: function (from, message) {
					console.log("sending message from :" + from.displayName + " & message is " + message);
					if (from && message) {
						var chatMessage = {
							from: from.displayName,
							message: message,
							createdAt: Firebase.ServerValue.TIMESTAMP
						};
						chats.$add(chatMessage).then(function (data) {
							console.log("message added");
						});
					}
				}
			}
		})

		/**
		 * Simple Service which returns Rooms collection as Array from Salesforce & binds to the Scope in Controller
		 */
		.factory('Rooms', function ($firebase) {
			// Might use a resource here that returns a JSON array
			var ref = new Firebase(firebaseUrl);
			var rooms = $firebase(ref.child('rooms')).$asArray();

			return {
				all: function () {
					return rooms;
				},
				get: function (roomId) {
					// Simple index lookup
					return rooms.$getRecord(roomId);
				}
			}
		});