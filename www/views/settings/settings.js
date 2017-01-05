mwApp
    .controller("settingsCtrl", function($scope,$rootScope,$state,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,base64,md5,$document,localStorageService){

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

        $scope.settings = {};


        // Set Motion
        $timeout(function(){
            ionicMaterialMotion.slideUp({
                selector: ".slide-up"
            });
        }, 300);
        // code

        $scope.clearLocalStorage = function(){
            localStorageService.remove('stops','routeOverview');
        }

        $scope.saveSettings = function(){
            localStorageService.add('settings',$scope.settings);
        }

        // animation ink (ionic-material)
        ionicMaterialInk.displayEffect();
    })
