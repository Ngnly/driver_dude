mwApp
    .controller("stop_singlesCtrl", function ($ionicConfig,
                                              $scope,
                                              $rootScope,
                                              $state,
                                              $location,
                                              $ionicScrollDelegate,
                                              $http,
                                              $httpParamSerializer,
                                              $stateParams,
                                              $timeout,
                                              $interval,
                                              $ionicLoading,
                                              $ionicPopup,
                                              $ionicPopover,
                                              $ionicSlideBoxDelegate,
                                              $ionicHistory,
                                              ionicMaterialInk,
                                              ionicMaterialMotion,
                                              $window,
                                              $ionicModal,
                                              base64,
                                              md5,
                                              $document,
                                              $sce,
                                              $ionicGesture,
                                              $ionicActionSheet,
                                              $ionicSideMenuDelegate,
                                              localStorageService) {

        //$scope.showMap =function(){
        //
        //}


        $rootScope.headerExists = true;
        $rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
        $rootScope.grid64 = parseInt($rootScope.ionWidth / 64);
        $rootScope.grid80 = parseInt($rootScope.ionWidth / 80);
        $rootScope.grid128 = parseInt($rootScope.ionWidth / 128);
        $rootScope.grid256 = parseInt($rootScope.ionWidth / 256);
        $rootScope.last_edit = "table (stop)";
        $scope.$on("$ionicView.afterEnter", function () {
            var page_id = $state.current.name;
            $rootScope.page_id = page_id.replace(".", "-");
        });
        $scope.$on("$ionicView.enter", function () {
            $scope.scrollTop();
            $ionicSideMenuDelegate.canDragContent(false);

        });
        $scope.$on('$ionicView.leave', function() {
            $ionicSideMenuDelegate.canDragContent(true);
        });

        // TODO: stop_singlesCtrl --|-- $scope.scrollTop
        $rootScope.scrollTop = function () {
            $ionicScrollDelegate.$getByHandle("top").scrollTop();
        };
        // TODO: stop_singlesCtrl --|-- $scope.openURL
        // open external browser
        $scope.openURL = function ($url) {
            window.open($url, "_system", "location=yes");
        };
        // TODO: stop_singlesCtrl --|-- $scope.openAppBrowser
        // open AppBrowser
        $scope.openAppBrowser = function ($url) {
            window.open($url, "_blank", "hardwareback=Done");
        };
        // TODO: stop_singlesCtrl --|-- $scope.openWebView
        // open WebView
        $scope.openWebView = function ($url) {
            window.open($url, "_self");
        };

        // TODO: stop_singlesCtrl --|-- $scope.redirect
        // redirect
        $scope.redirect = function ($url) {
            $window.location.href = $url;
        };

        // Set Motion
        $timeout(function () {
            ionicMaterialMotion.slideUp({
                selector: ".slide-up"
            });
        }, 300);

        // set default parameter http
        var http_params = {};

        // set HTTP Header
        var http_header = {
            headers: {},
            params: http_params
        };
        // animation loading
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });

        // Retrieving data
        var itemID = $stateParams.id;
        // TODO: stop_singlesCtrl --|-- $scope.fetchURL
        $scope.fetchURL = "http://api.mymobiledesigner.com/getRoute/"+localStorageService.get('route_id')+"/darrius";
        // TODO: stop_singlesCtrl --|-- $scope.fetchURLp
        $scope.fetchURLp = "http://api.mymobiledesigner.com/getRoute/"+localStorageService.get('route_id')+"/darrius";
        // TODO: stop_singlesCtrl --|-- $scope.hashURL
        $scope.hashURL = md5.createHash($scope.fetchURL);

        var current_item = [];
        $scope.london = {};
        $scope.london.lat =0;
        $scope.london.long =0;
        var long = 0;
        if (current_item.length === 0) {
            var itemID = $stateParams.id;
            var current_item = [];

            // set HTTP Header
            http_header = {
                headers: {},
                params: http_params
            };
            // TODO: stop_singlesCtrl --|-- $http.get
            $http.get($scope.fetchURL, http_header).then(function (response) {
                // Get data single
                var datas = response.data.stops;

                for (var i = 0; i < datas.length; i++) {
                    if ((parseInt(datas[i].id) === parseInt(itemID)) ) {
                        current_item = datas[i];
                    }
                }
                var lat =  parseFloat(current_item.lat),
                    long =  parseFloat(current_item.long);

                if(!lat || !long){
                    alert(lat+','+long);
                    alert(current_item.lat);
                    }
                else {

                var mainMarker = {
                    lat: lat,
                    lng: long,
                    focus: true,
                    message: current_item.Address,
                };

                angular.extend($scope, {
                    london: {
                        lat: lat,
                        lng: long,
                        zoom: 17
                    },
                    markers: {
                        mainMarker: angular.copy(mainMarker)
                    },
                    position: {
                        lat: lat,
                        lng: long
                    },
                    events: { // or just {} //all events
                        markers:{
                            enable: [ 'dragend' ]
                            //logic: 'emit'
                        }
                    }
                });
                    }
            }, function (data) {
                // Error message
                var alertPopup = $ionicPopup.alert({
                    title: "Network Error" + " (" + data.status + ")",
                    template: "An error occurred while collecting data." + "<br/><br/><pre>code: " + data.status + "<br/>error: " + data.statusText + "<br/>source: " + $rootScope.last_edit + "</pre>",
                });
                $timeout(function () {
                    alertPopup.close();
                }, 2000);
            }).finally(function () {
                $scope.$broadcast("scroll.refreshComplete");


                // event done, hidden animation loading
                $timeout(function () {
                    $ionicLoading.hide();
                    $scope.stop = current_item;
                    controller_by_user();
                }, 500);
            });
        }


        // TODO: stop_singlesCtrl --|-- $scope.doRefresh
        $scope.doRefresh = function () {
            // Retrieving data
            var itemID = $stateParams.id;
            var current_item = [];
            // overwrite http_header
            http_header = {
                headers: {},
                params: http_params
            };
            // TODO: stop_singlesCtrl --|------ $http.get
            $http.get($scope.fetchURL, http_header).then(function (response) {
                // Get data single
                var datas = response.data;
                for (var i = 0; i < datas.length; i++) {
                    if ((datas[i].id === parseInt(itemID)) || (datas[i].id === itemID.toString())) {
                        current_item = datas[i];
                    }
                }
            }, function (data) {
                // Error message
                // TODO: stop_singlesCtrl --|---------- $http.jsonp
                $http.jsonp($scope.fetchURLp, http_header).success(function (response) {
                    // Get data single
                    var datas = response;
                    for (var i = 0; i < datas.length; i++) {
                        if ((datas[i].id === parseInt(itemID)) || (datas[i].id === itemID.toString())) {
                            current_item = datas[i];
                        }
                    }
                    $scope.$broadcast("scroll.refreshComplete");
                    // event done, hidden animation loading
                    $timeout(function () {
                        $ionicLoading.hide();
                        $scope.stop = current_item;
                        controller_by_user();
                    }, 500);
                }).error(function (resp) {
                    var alertPopup = $ionicPopup.alert({
                        title: "Network Error" + " (" + data.status + ")",
                        template: "An error occurred while collecting data." + "<br/><br/><pre>code: " + data.status + "<br/>error: " + data.statusText + "<br/>source: " + $rootScope.last_edit + "</pre>",
                    });
                });
            }).finally(function () {
                $scope.$broadcast("scroll.refreshComplete");
                // event done, hidden animation loading
                $timeout(function () {
                    $ionicLoading.hide();
                    $scope.stop = current_item;
                    controller_by_user();
                }, 500);
            });
        };
        // code

        // TODO: stop_singlesCtrl --|-- controller_by_user
        // controller by user
        function controller_by_user() {
            try {


                //map.addControl(new mapboxgl.Navigation({position: 'bottom-left'}));
                $scope.data = {};
// Triggered on a button click, or some other target
                $scope.show = function () {

                    // Show the action sheet
                    var hideSheet = $ionicActionSheet.show({
                        buttons: [
                            {text: '<b>Update Stop</b>'},
                            {text: 'View Manifest'},
                            {text: '<b>Capture Signature</b>'}
                        ],
                        destructiveText: 'Report Issue',
                        titleText: 'What would you like to do?',
                        cancelText: 'Close',
                        destructiveButtonClicked: function () {
                            $scope.showPopup();
                            return true;
                        },
                        //cancel: true,
                        buttonClicked: function (index) {
                            if (index == 0)
                                $scope.showConfirm();
                            if (index == 2)
                                $scope.captureSignature.show();
                            return true;
                        }
                    });


                };
                $scope.showPopup = function () {
                    $scope.data = {}

                    // An elaborate, custom popup
                    var myPopup = $ionicPopup.show({
                        template: '<textarea  ng-model="data.reason">',
                        title: 'Enter Issues Below',
                        subTitle: 'Be Detailed',
                        scope: $scope,
                        buttons: [
                            {
                                text: 'Cancel',
                                type: 'button-assertive'
                            },
                            {
                                text: '<b>Report</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.data.reason) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                        $scope.showAlert();
                                    } else {
                                        return $scope.data.reason;
                                    }
                                }
                            },
                        ]
                    });
                    myPopup.then(function (res) {
                        $scope.data.json = "updateStopDetails";
                        $scope.data.id = $scope.stop.id;

                        var req = {
                            method: 'POST',
                            url: 'http://mwls.mymobiledesigner.com/api2/',
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8;"
                            },
                            data: $httpParamSerializer($scope.data)
                        }

                        $http(req).then(function (data) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'HQ has been notified'
                            });
                        }, function () {
                            alert('failure');
                        });
                    });

                };
// A confirm dialog
                $scope.showConfirm = function () {
                    $scope.updateData = {}
                    var stopID = $scope.stop.id;
                    $scope.updateData.id = stopID;
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Complete Stop #' + stopID,
                        scope: $scope,
                        cssClass: 'completeStopModal',


                        template: '<h4>Delivery</h4>' +
                        '<div class="row">' +
                        '<div class="col1 "><input ng-model="updateData.deliverClean" type="number" name="delivered"></div>' +
                        '</div>' +
                        '<h4>Pick-Up</h4>' +
                        '<div class="row">' +
                        '<div class="col1 "><label>Clean</label><input ng-model="updateData.pickupClean" type="number" ></div>' +
                        '<div class="col1 "><label>Soiled</label><input ng-model="updateData.pickupSoil" type="number" ></div>' +
                        '</div> ' +
                        '<ion-checkbox ng-model="updateData.additional">Additional Pickups?</ion-checkbox>' +
                        '<div class="row">' +
                        '<div class="col1 "><label  ng-show="updateData.additional">Number Remaining</label></di>' +
                        '<div class="col1 "><input ng-show="updateData.additional" ng-model="updateData.pickupAdditional" type="number" ></div></div>',
                        buttons: [
                            {
                                text: 'Cancel',
                                type: 'button-assertive'
                            },
                            {
                                text: '<b>Complete</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.updateData.deliverClean && ( !$scope.updateData.pickupClean || !$scope.updateData.pickupSoil)) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                        $scope.showAlert();
                                    } else if ($scope.updateData.deliverClean != $scope.stop.carts) {
                                        e.preventDefault();

                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Missing Carts!',
                                            template: 'You should be delivering <b>' + $scope.stop.carts + '</b>'
                                        });

                                    }
                                    else {
                                        return $scope.updateData;

                                    }
                                }
                            },
                        ]

                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $scope.updateData.json = 'updateStop';
                            //alert(JSON.stringify($scope.updateData));
                            var req = {
                                method: 'POST',
                                url: 'http://mwls.mymobiledesigner.com/api2/',
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8;"
                                },
                                data: $httpParamSerializer($scope.updateData)
                            }

                            $http(req).then(function (data) {
                                //alert(data);
                            }, function () {
                                alert('failure');
                            });
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'HQ has been notified'
                            });
                        } else {
                            console.log('You are not sure');
                        }

                    });
                };

// An alert dialog
                $scope.showAlert = function () {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Missing Information',
                        template: 'Make sure everything is valid'
                    });
                    alertPopup.then(function (res) {
                        console.log('Thank you for not eating my delicious ice cream cone');
                    });
                };
                var n = $ionicModal.fromTemplateUrl('/templates/capture_signature.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.captureSignature = modal;
                });
                $scope.openModal = function () {
                    $scope.captureSignature.show();
                };
                $scope.closeModal = function () {
                    //console.log($scope.signaturePad.toDataURL());
                    $scope.captureSignature.hide();
                    //if(signature.dataUrl)
                };
                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.captureSignature.remove();
                });
                // Execute action on hide modal
                $scope.$on('captureSignature.hidden', function () {
                    // Execute action
                    //alert(signature.dataUrl);

                });
                // Execute action on remove modal
                $scope.$on('captureSignature.removed', function () {
                    // Execute action
                });

            } catch (e) {
                console.log("%cerror: %cPage: `stop_singles` and field: `Custom Controller`", "color:blue;font-size:18px", "color:red;font-size:18px");
                console.dir(e);
            }
        }


        // animation ink (ionic-material)
        ionicMaterialInk.displayEffect();
        //controller_by_user();
    })
