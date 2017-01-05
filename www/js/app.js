angular.module("driver_dude",

    ["leaflet-directive",
        "ngToast",
        "ngCordova",
        "ionic",
        "ionMdInput",
        "ionic-material",
        "ionic.rating",
        "utf8-base64",
        "angular-md5",
        "ionicLazyLoad",
        "driver_dude.controllers",
        "driver_dude.services",
        "LocalStorageModule",
        "signature",
        "firebase",
        "ngMessages",
        'pascalprecht.translate',
        'ngStorage'
    ])


    .filter("to_trusted", ["$sce", function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])

    .filter("trustUrl", function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    })

    .filter("trustJs", ["$sce", function ($sce) {
        return function (text) {
            return $sce.trustAsJs(text);
        };
    }])

    .filter("strExplode", function () {
        return function ($string, $delimiter) {
            if (!$string.length) return;
            var $_delimiter = $delimiter || "|";
            return $string.split($_delimiter);
        };
    })

    .filter("strDate", function () {
        return function (input) {
            return new Date(input);
        }
    })
    .filter("strHTML", ["$sce", function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])
    .filter("strEscape", function () {
        return window.encodeURIComponent;
    })


    .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, $ionicConfigProvider, $translateProvider, $translateStaticFilesLoaderProvider) {

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.fallbackLanguage("en");

        $translateProvider.useStaticFilesLoader({
            prefix: 'langs/lang-',
            suffix: '.json'
        });

        try {
            // Domain Whitelist
            $sceDelegateProvider.resourceUrlWhitelist([
                "self",
                new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
                new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
            ]);
        } catch (err) {
            console.log("%cerror: %cdomain whitelist", "color:blue;font-size:16px;", "color:red;font-size:16px;");
        }
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login/login.html',
                controller:'loginController'
            })

              .state('register', {
                url: '/register',
                templateUrl: 'views/register/register.html',
                controller:'registerController'
            })

              .state('forgot', {
                url: '/forgot',
                templateUrl: 'views/forgot/forgot.html',
                controller:'forgotController'
            })

            .state("driver_dude", {
                url: "/driver_dude",
                abstract: true,
                templateUrl: "templates/mls_driver_2-side_menus.html",
                controller: "side_menusCtrl",
            })

            .state("driver_dude.about", {
                url: "/about",
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "templates/mls_driver_2-about.html",
                        controller: "aboutCtrl"
                    },
                    "fabButtonUp": {
                        template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab- button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById("fab-up-button").classList.toggle("on");
                            }, 900);
                        }
                    },
                }
            })

            .state("driver_dude.chat", {
                url: "/chat",
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "templates/mls_driver_2-chat.html",
                        controller: "chatCtrl"
                    },
                    "fabButtonUp": {
                        template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab- button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById("fab-up-button").classList.toggle("on");
                            }, 900);
                        }
                    },
                }
            })

            .state("driver_dude.dashboard", {
                url: "/dashboard",
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "templates/mls_driver_2-dashboard.html",
                        controller: "dashboardCtrl"
                    },
                }
            })

            .state("driver_dude.form_pre_check_form", {
                url: "/form_pre_check_form",
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "templates/mls_driver_2-form_pre_check_form.html",
                        controller: "form_pre_check_formCtrl"
                    },
                    "fabButtonUp": {
                        template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab- button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById("fab-up-button").classList.toggle("on");
                            }, 900);
                        }
                    },
                }
            })

            .state("driver_dude.forms", {
                url: "/forms",
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "templates/mls_driver_2-forms.html",
                        controller: "formsCtrl"
                    },
                    "fabButtonUp": {
                        template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab- button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById("fab-up-button").classList.toggle("on");
                            }, 900);
                        }
                    },
                }
            })


            .state("driver_dude.precheck", {
                url: "/precheck",
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "templates/mls_driver_2-precheck.html",
                        controller: "precheckCtrl"
                    },
                    "fabButtonUp": {
                        template: '',
                    },
                }
            })

            .state("driver_dude.route_overview", {
                url: "/route_overview",
                cache: false,
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "views/route-overview/route-overview.html",
                        controller: "route_overviewCtrl"
                    },
                    "fabButtonUp": {
                        template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById("fab-up-button").classList.toggle("on");
                            }, 900);
                        }
                    },
                }
            })

            .state("driver_dude.settings", {
                url: "/settings",
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "views/settings/settings.html",
                        controller: "settingsCtrl"
                    },

                }
            })

            .state("driver_dude.stop_singles", {
                url: "/stop/:id",
                cache: false,
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "views/route-single/route-single.html",
                        controller: "stop_singlesCtrl"
                    },
                }
            })
            .state("driver_dude.scan", {
                url: "/scan",
                cache: false,
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "views/item-scan/item-scan.html",
                        controller: "item_ScanCtrl"
                    },
                }
            })
            .state("driver_dude.route_start", {
                url: "/route_start/:id",
                cache: false,
                views: {
                    "mls_driver_2-side_menus": {
                        templateUrl: "views/route-start/route-start.html",
                        controller: "route_startCtrl"
                    },
                }
            })

        $urlRouterProvider.otherwise("/login");
    })

    .constant('FURL', {
        apiKey: "AIzaSyB7t-zWirFg5M-toim4JHRj1JZmxN53tXA",
        authDomain: "moneysworth-driver-app.firebaseapp.com",
        databaseURL: "https://moneysworth-driver-app.firebaseio.com",
        storageBucket: "moneysworth-driver-app.appspot.com",
        }
    )
    .run(function ($ionicPlatform, $window, $interval, GeoAlert) {
        $ionicPlatform.ready(function (FURL) {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }


            //Begin the service
            //hard coded 'target'

            var targetList = [];
            //first target (Louisiana)
            targetList.push({lat: 36.853059, long: -76.036769, label: "demo0 "});
            //second target (Paris)
            targetList.push({lat: 48.87146, long: 2.355, label: "Paris"});

            function onConfirm(idx) {
                console.log('button ' + idx + ' pressed');
            }

            GeoAlert.begin(targetList, function (matchedTargets) {
                console.log('Close Targets! ', matchedTargets);
                GeoAlert.end();
                navigator.notification.confirm(
                    'You are near a target!',
                    onConfirm,
                    'Target!',
                    ['Cancel', 'View']
                );

            });

        });
    })
