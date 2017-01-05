mwApp
    .controller("route_startCtrl",
        function ($ionicSideMenuDelegate,
                  $ionicConfig,
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
                  localStorageService,
                  ngToast) {

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

            /************************************************************!
             * Disable Dragging when entering page
             ************************************************************/
            $scope.$on("$ionicView.enter", function () {
                $ionicSideMenuDelegate.canDragContent(false);
                $scope.initStops();
            });

            /************************************************************!
             * Enable Dragging when leaving page
             ************************************************************/
            $scope.$on('$ionicView.leave', function () {
                $ionicSideMenuDelegate.canDragContent(true);
            });

            // Set Motion
            $timeout(function () {
                ionicMaterialMotion.slideUp({
                    selector: ".slide-up"
                });
            }, 300);

            /************************************************************!
             * Setup Slider Options
             ************************************************************/
            $scope.sliderOptions = {loop: true};

            /************************************************************!
             * Setup Scope Variables
             ************************************************************/
            $scope.currentLatLng = {};


            $scope.updateData = {};
            $scope.updateData.stopActive = false;
            $scope.user = {};
            $scope.user.routeID = localStorageService.get('route_id');
            $scope.user.username = 'darrius';

            $scope.fetchURL = "http://api.mymobiledesigner.com/getRoute/" + $scope.user.routeID + "/" + $scope.user.username;

            /************************************************************!
             * doStop Function
             ************************************************************/
            $scope.doStop = function (action, $index) {

                var stopData = localStorageService.get('stops');
                if (stopData === null)
                    alert('Local Storage Stop Data Empty');

                var current = stopData[$index];

                console.log(stopData);

                if (action == 'lockStop') {
                    if ($scope.updateData.stopActive) {
                        $scope.updateData.stopActive = false;
                        $ionicSlideBoxDelegate.enableSlide(1);


                    }
                    else {
                        $scope.updateData.stopActive = true;
                        $ionicSlideBoxDelegate.enableSlide(0);

                    }
                } else {
                    $ionicLoading.show({
                        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
                    });
                    if (action == 'complete') {
                        var status = 1;
                    }
                    if (action == 'skip') {
                        var status = 3;
                    }
                    if (action == 'comeback') {
                        var status = 4;
                    }
                    if (action == 'partial') {
                        var status = 2;
                    }
                    var updateData_params = {

                        scanned: $scope.updateData.scans,
                        location: '1',
                        status: status,
                        route: $scope.user.routeID,
                        noscan: {},
                        type: current.type,
                        ticket_id: current.ticket_id,
                        user_id: 1,
                        message: $scope.updateData.notes

                    };


                    var url_request = 'http://api.mymobiledesigner.com/v2/syncData/';

                    $http({
                        method: "POST",
                        url: url_request,
                        data: $httpParamSerializer(updateData_params),  // pass in data as strings
                        headers: {"Content-Type": "application/x-www-form-urlencoded"}  // set the headers so angular passing info as form data (not request payload)
                    }).then(function (response) {

                        $scope.dataReturn = response.data;
                        if ($scope.dataReturn.status == 'error') {
                            $ionicPopup.alert({
                                title: 'Error',
                                template: $scope.dataReturn.message
                            });
                        }
                        else {
                            $scope.updateData.stopActive = false;
                            $ionicSlideBoxDelegate.enableSlide(1);
                            ngToast.create($scope.dataReturn.message);

                            $scope.nextSlide();

                            //$scope.data_stops.stops[$index].status='Completed';
                        }

                    }, function () {

                    }).finally(function (response) {


                        $scope.$broadcast("scroll.refreshComplete");
                        $ionicSlideBoxDelegate.update();
                        // event done, hidden animation loading
                        $timeout(function () {
                            $ionicLoading.hide();
                        }, 1000);
                    });
                }
            }

            /************************************************************!
             * nextSlide Function
             ************************************************************/
            $scope.nextSlide = function () {
                $ionicSlideBoxDelegate.next();
                $scope.slideHasChanged($ionicSlideBoxDelegate.currentIndex);
            }

            /************************************************************!
             * initStops Function
             ************************************************************/
            $scope.initStops = function () {


                var http_params = {};
                var http_header = {
                    headers: {},
                    params: http_params
                };


                // animation loading
                $ionicLoading.show({
                    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
                });


                $scope.noMoreItemsAvailable = false; //readmore status
                $scope.totalStops = 0;
                $scope.lsKeys = localStorageService.keys();

                var lastPush = 0;
                var data_stops = [];

                if (data_stops === null) {
                    data_stops = [];
                }
                var cachedStops = (localStorageService.get('stops') !== null) ? localStorageService.get('stops') : [];

                if (cachedStops.length !== 0) {
                    data_stops = cachedStops;
                    console.log("%cSuccessfully", "color:blue;font-size:18px");
                    console.dir(data_stops);
                    $scope.data_stops = cachedStops;
                    $scope.totalStops = cachedStops.length;
                    $scope.activeIndex = $ionicSlideBoxDelegate.currentIndex();
                    $scope.routeOverview = localStorageService.get('routeOverview');

                    $scope.stops = [];
                    for (lastPush = 0; lastPush < 100; lastPush++) {
                        if (angular.isObject(data_stops[lastPush])) {
                            $scope.stops.push(data_stops[lastPush]);
                        }

                    }
                    $scope.$broadcast("scroll.refreshComplete");

                    // event done, hidden animation loading
                    $timeout(function () {
                        $ionicLoading.hide();
                        $ionicSlideBoxDelegate.update();

                        var itemID = $stateParams.id;

                        $ionicSlideBoxDelegate.slide(itemID);

                    }, 1000);
                }
                else {
                    $timeout(function () {
                        var url_request = $scope.fetchURL;
                        // overwrite HTTP Header
                        http_header = {
                            headers: {},
                            params: http_params
                        };
                        // TODO: route_overviewCtrl --|-- $http.get
                        console.log("%cRetrieving JSON: %c" + url_request, "color:blue;font-size:18px", "color:red;font-size:18px");
                        $http.get(url_request, http_header).then(function (response) {
                            data_stops = response.data.stops;
                            console.log("%cSuccessfully", "color:blue;font-size:18px");
                            console.dir(data_stops);
                            $scope.data_stops = response.data;
                            $scope.totalStops = response.data.info.totalStops;
                            $scope.activeIndex = $ionicSlideBoxDelegate.currentIndex();
                            localStorageService.set('stops', data_stops);
                            localStorageService.set('routeOverview', response.data.info);

                            $scope.routeOverview = response.data.info;


                            //alert($scope.totalStops);
                            $scope.stops = [];
                            for (lastPush = 0; lastPush < 100; lastPush++) {
                                if (angular.isObject(data_stops[lastPush])) {
                                    var name = 'stop' + data_stops[lastPush].ticket_id;
                                    localStorageService.set(name, data_stops[lastPush]);
                                    $scope.stops.push(data_stops[lastPush]);
                                }

                            }
                        }, function (response) {

                            $timeout(function () {
                                var url_request = $scope.fetchURL;
                                // overwrite HTTP Header
                                http_header = {
                                    headers: {},
                                    params: http_params
                                };
                                console.log("%cRetrieving again: %c" + url_request, "color:blue;font-size:18px", "color:red;font-size:18px");
                                // TODO: route_overviewCtrl --|------ $http.jsonp
                                $http.jsonp(url_request, http_header).success(function (data) {
                                    data_stops = data;
                                    $scope.data_stops = data;
                                    $ionicLoading.hide();
                                    $scope.stops = [];
                                    for (lastPush = 0; lastPush < 100; lastPush++) {
                                        if (angular.isObject(data_stops[lastPush])) {
                                            $scope.stops.push(data_stops[lastPush]);
                                        }
                                        ;
                                    }
                                }).error(function (data) {
                                    if (response.status === 401) {
                                        // TODO: route_overviewCtrl --|------------ error:Unauthorized
                                        $scope.showAuthentication();
                                    } else {
                                        // TODO: route_overviewCtrl --|------------ error:Message
                                        var data = {statusText: response.statusText, status: response.status};
                                        var alertPopup = $ionicPopup.alert({
                                            title: "Network Error" + " (" + data.status + ")",
                                            template: "An error occurred while collecting data." + "<br/><br/><pre>code: " + data.status + "<br/>error: " + data.statusText + "<br/>source: " + $rootScope.last_edit + "</pre>",
                                        });
                                        $timeout(function () {
                                            alertPopup.close();
                                        }, 2000);
                                    }
                                });
                            }, 1000);
                        }).finally(function () {
                            $scope.$broadcast("scroll.refreshComplete");
                            $ionicSlideBoxDelegate.update();
                            // event done, hidden animation loading
                            $timeout(function () {
                                $ionicLoading.hide();
                                var itemID = $stateParams.id;

                                $ionicSlideBoxDelegate.slide(itemID);

                            }, 1000);
                        });

                    }, 1000);
                }
            }


            /************************************************************!
             * slideHasChanged Function
             ************************************************************/
            $scope.slideHasChanged = function ($index) {


                var cachedStops = localStorageService.get('stops');


                $timeout(function () {
                    var currentStop = cachedStops[$index],
                        totalStops = $scope.totalStops;
                    if (currentStop.length !== null) {
                        $scope.activeIndex = $index;
                        $scope.currentLatLng.lat = parseFloat(currentStop.lat);
                        $scope.currentLatLng.long = parseFloat(currentStop.long);
                        var mainMarker = {
                            lat: parseFloat(currentStop.lat),
                            lng: parseFloat(currentStop.long),
                            focus: true,
                            message: currentStop.Address,
                        };
                        angular.extend($scope, {
                            currentLatLng: {
                                lat: parseFloat(currentStop.lat),
                                lng: parseFloat(currentStop.long),
                                zoom: 15
                            },
                            markers: {
                                mainMarker: angular.copy(mainMarker)
                            },
                            position: {
                                lat: parseFloat(currentStop.lat),
                                lng: parseFloat(currentStop.long)
                            }
                        });
                    } else {
                        alert('summary');
                    }
                }, 500);
            };

            /************************************************************!
             * addScan Function
             ************************************************************/

            $scope.updateData.savedScans = localStorageService.get('scans');
            $scope.updateData.scans = (localStorageService.get('scans') !== null) ? $scope.updateData.savedScans : [];
            localStorageService.set('scans', $scope.scans);

            $scope.addScan = function (barcode) {
                $scope.updateData.scans.push(barcode);
                localStorageService.set('scans', $scope.scans);

                $scope.updateData.barcodeScan = ''; //clear the input after adding

            };

            /************************************************************!
             * doScan Function
             ************************************************************/

            $scope.doScan = function () {

            };
            /************************************************************!
             * doRefresh Function
             ************************************************************/
            $scope.doRefresh = function () {
                $timeout(function () {
                    var url_request = $scope.fetchURL;

                    // overwrite HTTP Header
                    var http_header = {
                        headers: {},
                        params: {}
                    };
                    // TODO: route_overviewCtrl --|-- $http.get
                    console.log("%cRetrieving JSON: %c" + url_request, "color:blue;font-size:18px", "color:red;font-size:18px");
                    $http.get(url_request, http_header).then(function (response) {
                        var data_stops = response.data.stops;
                        console.log("%cSuccessfully", "color:blue;font-size:18px");
                        console.dir(data_stops);
                        $scope.data_stops = response.data.stops;
                        $scope.totalStops = response.data.info.totalStops;
                        $scope.activeIndex = $ionicSlideBoxDelegate.currentIndex();
                        localStorageService.set('stops', data_stops);
                        localStorageService.set('routeOverview', response.data.info);

                        $scope.routeOverview = response.data.info;
                        //alert($scope.totalStops);
                        $scope.stops = [];
                        for (var lastPush = 0; lastPush < 100; lastPush++) {
                            if (angular.isObject(data_stops[lastPush])) {
                                $scope.stops.push(data_stops[lastPush]);
                            }

                        }
                    }, function (response) {

                        $timeout(function () {
                            var url_request = $scope.fetchURL;
                            // overwrite HTTP Header
                            http_header = {
                                headers: {},
                                params: {}
                            };
                            console.log("%cRetrieving again: %c" + url_request, "color:blue;font-size:18px", "color:red;font-size:18px");
                            // TODO: route_overviewCtrl --|------ $http.jsonp
                            $http.jsonp(url_request, http_header).success(function (data) {
                                data_stops = data;
                                $scope.data_stops = data;
                                $ionicLoading.hide();
                                $scope.stops = [];
                                for (var lastPush = 0; lastPush < 100; lastPush++) {
                                    if (angular.isObject(data_stops[lastPush])) {
                                        $scope.stops.push(data_stops[lastPush]);
                                    }
                                    ;
                                }
                            }).error(function (data) {
                                if (response.status === 401) {
                                    // TODO: route_overviewCtrl --|------------ error:Unauthorized
                                    $scope.showAuthentication();
                                } else {
                                    // TODO: route_overviewCtrl --|------------ error:Message
                                    var data = {statusText: response.statusText, status: response.status};
                                    var alertPopup = $ionicPopup.alert({
                                        title: "Network Error" + " (" + data.status + ")",
                                        template: "An error occurred while collecting data." + "<br/><br/><pre>code: " + data.status + "<br/>error: " + data.statusText + "<br/>source: " + $rootScope.last_edit + "</pre>",
                                    });
                                    $timeout(function () {
                                        alertPopup.close();
                                    }, 2000);
                                }
                            });
                        }, 1000);
                    }).finally(function () {
                        $scope.$broadcast("scroll.refreshComplete");
                        $ionicSlideBoxDelegate.update();
                        // event done, hidden animation loading
                        $timeout(function () {
                            $ionicLoading.hide();
                            var itemID = $ionicSlideBoxDelegate.currentIndex();

                            $ionicSlideBoxDelegate.slide(itemID);

                        }, 1000);
                    });

                }, 1000)
            };


            // animation ink (ionic-material)
            ionicMaterialInk.displayEffect();
        })

