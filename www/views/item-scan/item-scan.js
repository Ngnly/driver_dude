mwApp
    .controller("item_ScanCtrl", function ($ionicConfig,
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
                                              $ionicActionSheet) {

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

        $ionicLoading.hide();
        // Retrieving data
        //var itemID = $stateParams.id;
        $scope.scan = {};
        $scope.scan.barcode = '25_G3150210_000';

        // TODO: stop_singlesCtrl --|-- $scope.fetchURL
        $scope.fetchURL = "http://api.mymobiledesigner.com/inventory/scan/";
        // TODO: stop_singlesCtrl --|-- $scope.fetchURLp
        $scope.fetchURLp = "http://api.mymobiledesigner.com/inventory/scan/";
        // TODO: stop_singlesCtrl --|-- $scope.hashURL
        $scope.hashURL = md5.createHash($scope.fetchURL);




        // TODO: stop_singlesCtrl --|-- $scope.doRefresh
        $scope.doScan = function () {
            $ionicLoading.show({
                template: '<div class="loader">		<img src="data/images/images/barcode.gif" alt=""></div>'
            });
            // Retrieving data
            var barcode = $scope.scan.barcode;


            var current_item = [];
            // overwrite http_header
            http_header = {
                headers: {},
                params: {}
            };
            // TODO: stop_singlesCtrl --|------ $http.get
            $http.get($scope.fetchURL+barcode, http_header).then(function (response) {
                // Get data single
                var datas = response.data;
                $scope.scan.return = datas[0];

            }, function (data) {

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
