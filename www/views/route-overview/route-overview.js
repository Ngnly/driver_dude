mwApp
    .controller("route_overviewCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,localStorageService){

    $rootScope.headerExists = true;
    $rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
    $rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
    $rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
    $rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
    $rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
    $rootScope.last_edit = "table (stop)" ;
    $scope.$on("$ionicView.afterEnter", function (){
        var page_id = $state.current.name ;
        $rootScope.page_id = page_id.replace(".","-") ;
    });
    $scope.$on("$ionicView.enter", function (){
        $scope.scrollTop();
    });
    // TODO: route_overviewCtrl --|-- $scope.scrollTop
    $rootScope.scrollTop = function(){
        $ionicScrollDelegate.$getByHandle("top").scrollTop();
    };
    // TODO: route_overviewCtrl --|-- $scope.openURL
    // open external browser
    $scope.openURL = function($url){
        window.open($url,"_system","location=yes");
    };
    // TODO: route_overviewCtrl --|-- $scope.openAppBrowser
    // open AppBrowser
    $scope.openAppBrowser = function($url){
        window.open($url,"_blank","hardwareback=Done");
    };
    // TODO: route_overviewCtrl --|-- $scope.openWebView
    // open WebView
    $scope.openWebView = function($url){
        window.open($url,"_self");
    };

    // TODO: route_overviewCtrl --|-- $scope.redirect
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
    // TODO: route_overviewCtrl --|-- $scope.showAuthentication
    $scope.showAuthentication  = function(){
        var authPopup = $ionicPopup.show({
            template: ' This page required login',
            title: "Authorization",
            subTitle: "Authorization is required",
            scope: $scope,
            buttons: [
                {text:"Cancel",onTap: function(e){
                    $state.go("driver_dude.dashboard");
                }},
            ],
        }).then(function(form){
        },function(err){
        },function(msg){
        });
    };

    // set default parameter http
    var http_params = {};

    // set HTTP Header
    var http_header = {
        headers: {
        },
        params: http_params
    };
    var targetQuery = ""; //default param
    var raplaceWithQuery = "";
    var route_id  = localStorageService.get('route_id');
    //fix url Route {{user.route}} Overview
    targetQuery = "json=stop"; //default param
    raplaceWithQuery = "json=stop&route_id="+route_id;


    // TODO: route_overviewCtrl --|-- $scope.splitArray
    $scope.splitArray = function(items,cols,maxItem) {
        var newItems = [];
        if(maxItem == 0){
            maxItem = items.length;
        }
        if(items){
            for (var i=0; i < maxItem; i+=cols) {
                newItems.push(items.slice(i, i+cols));
            }
        }
        return newItems;
    }
    $scope.gmapOptions = {options: { scrollwheel: false }};

    var fetch_per_scroll = 1;
    // animation loading
    $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
    });


    // TODO: route_overviewCtrl --|-- $scope.fetchURL
    $scope.fetchURL = "http://api.mymobiledesigner.com/getRoute/"+localStorageService.get('route_id')+"/darrius";
    // TODO: route_overviewCtrl --|-- $scope.fetchURLp
    $scope.fetchURLp = "http://api.mymobiledesigner.com/getRoute/"+localStorageService.get('route_id')+"/darrius";
    // TODO: route_overviewCtrl --|-- $scope.hashURL
    $scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));


    $scope.noMoreItemsAvailable = false; //readmore status
    var lastPush = 0;
    var data_stops = [];

    if(data_stops === null ){
        data_stops =[];
    }
    if(data_stops.length === 0 ){
        $timeout(function() {
            var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
            // overwrite HTTP Header
            http_header = {
                headers: {
                },
                params: http_params
            };
            // TODO: route_overviewCtrl --|-- $http.get
            console.log("%cRetrieving JSON: %c" + url_request,"color:blue;font-size:18px","color:red;font-size:18px");
            $http.get(url_request,http_header).then(function(response) {
                data_stops = response.data.stops;
                console.log("%cSuccessfully","color:blue;font-size:18px");
                console.dir(data_stops);
                $scope.data_stops = response.data;
                $scope.stops = [];
                for(lastPush = 0; lastPush < 100; lastPush++) {
                    if (angular.isObject(data_stops[lastPush])){
                        $scope.stops.push(data_stops[lastPush]);
                    };
                }
            },function(response) {

                $timeout(function() {
                    var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
                    // overwrite HTTP Header
                    http_header = {
                        headers: {
                        },
                        params: http_params
                    };
                    console.log("%cRetrieving again: %c" + url_request,"color:blue;font-size:18px","color:red;font-size:18px");
                    // TODO: route_overviewCtrl --|------ $http.jsonp
                    $http.jsonp(url_request,http_header).success(function(data){
                        data_stops = data;
                        $scope.data_stops = data;
                        $ionicLoading.hide();
                        controller_by_user();
                        $scope.stops = [];
                        for(lastPush = 0; lastPush < 100; lastPush++) {
                            if (angular.isObject(data_stops[lastPush])){
                                $scope.stops.push(data_stops[lastPush]);
                            };
                        }
                    }).error(function(data){
                        if(response.status ===401){
                            // TODO: route_overviewCtrl --|------------ error:Unauthorized
                            $scope.showAuthentication();
                        }else{
                            // TODO: route_overviewCtrl --|------------ error:Message
                            var data = { statusText:response.statusText, status:response.status };
                            var alertPopup = $ionicPopup.alert({
                                title: "Network Error" + " (" + data.status + ")",
                                template: "An error occurred while collecting data." + "<br/><br/><pre>code: " + data.status + "<br/>error: " + data.statusText + "<br/>source: " + $rootScope.last_edit + "</pre>",
                            });
                            $timeout(function() {
                                alertPopup.close();
                            }, 2000);
                        }
                    });
                }, 1000);
            }).finally(function() {
                $scope.$broadcast("scroll.refreshComplete");
                // event done, hidden animation loading
                $timeout(function() {
                    $ionicLoading.hide();
                    controller_by_user();
                }, 1000);
            });

        }, 1000);
    }


    // TODO: route_overviewCtrl --|-- $scope.doRefresh
    $scope.doRefresh = function(){
        var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
        // retry retrieving data
        // overwrite http_header
        http_header = {
            headers: {
            },
            params: http_params
        };
        // TODO: route_overviewCtrl --|------ $http.get
        $http.get(url_request,http_header).then(function(response) {
            data_stops = response.data.stops;
            $scope.data_stops = response.data.stops;
            $scope.stops = [];
            for(lastPush = 0; lastPush < 100; lastPush++) {
                if (angular.isObject(data_stops[lastPush])){
                    $scope.stops.push(data_stops[lastPush]);
                };
            }
        },function(response){

            // retrieving data with jsonp
            $timeout(function() {
                var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
                // overwrite http_header
                http_header = {
                    headers: {
                    },
                    params: http_params
                };
                // TODO: route_overviewCtrl --|---------- $http.jsonp
                $http.jsonp(url_request,http_header).success(function(data){
                    data_stops = data;
                    $scope.data_stops = data;
                    $ionicLoading.hide();
                    controller_by_user();
                    $scope.stops = [];
                    for(lastPush = 0; lastPush < 100; lastPush++) {
                        if (angular.isObject(data_stops[lastPush])){
                            $scope.stops.push(data_stops[lastPush]);
                        };
                    }
                }).error(function(resp){
                    if(response.status ===401){
                        // TODO: route_overviewCtrl --|------------ error:Unauthorized
                        $scope.showAuthentication();
                    }else{
                        // TODO: route_overviewCtrl --|------------ error:Message
                        var data = { statusText:response.statusText, status:response.status };
                        var alertPopup = $ionicPopup.alert({
                            title: "Network Error" + " (" + data.status + ")",
                            template: "An error occurred while collecting data." + "<br/><br/><pre>code: " + data.status + "<br/>error: " + data.statusText + "<br/>source: " + $rootScope.last_edit + "</pre>",
                        });
                    };
                });
            }, 1000);
        }).finally(function() {
            $scope.$broadcast("scroll.refreshComplete");
            // event done, hidden animation loading
            $timeout(function() {
                $ionicLoading.hide();
                controller_by_user();
            }, 500);
        });

    };
    if (data_stops === null){
        data_stops = [];
    };
    // animation readmore
    var fetchItems = function() {
        for(var z=0;z<fetch_per_scroll;z++){
            if (angular.isObject(data_stops[lastPush])){
                $scope.stops.push(data_stops[lastPush]);
                lastPush++;
            }else{;
                $scope.noMoreItemsAvailable = true;
            }
        }
        $scope.$broadcast("scroll.infiniteScrollComplete");
    };

    // event readmore
    $scope.onInfinite = function() {
        $timeout(fetchItems, 500);
    };

    // create animation fade slide in right (ionic-material)
    $scope.fireEvent = function(){
        ionicMaterialMotion.fadeSlideInRight();
        ionicMaterialInk.displayEffect();
    };
    // code
    $scope.user = {};
    $scope.user.route = localStorageService.get('route_id');
    // TODO: route_overviewCtrl --|-- controller_by_user
    // controller by user
    function controller_by_user(){
        try {

//debug: all data
            console.log(data_stops);

        } catch(e){
            console.log("%cerror: %cPage: `route_overview` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
            console.dir(e);
        }
    }
    $scope.rating = {};
    $scope.rating.max = 5;

    // animation ink (ionic-material)
    ionicMaterialInk.displayEffect();
    controller_by_user();
})

