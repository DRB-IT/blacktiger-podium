var blacktigerApp = angular.module('blacktiger-podium', ['ionic', 'blacktiger-podium.controllers', 'blacktiger-podium.services', 'blacktiger']);

blacktigerApp
        .run(function ($ionicPlatform, $rootScope, LoginSvc, $location, PushEventSvc, AutoCommentRequestCancelSvc, MeetingSvc) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
            
            $rootScope.context = {};
    
            LoginSvc.authenticate().then(angular.noop, function () {
                $location.path('/signin');
            });

            $rootScope.$on("afterLogout", function () {
                $rootScope.rooms = null;
                $rootScope.updateCurrentRoom();
                $location.path('/signin');
            });

            $rootScope.$on("login", function (event, user) {
                PushEventSvc.connect().then(function() {
                    $location.path('/comments');
                    $rootScope.updateCurrentRoom();
                }, function() {
                    alert('Unable to connect');
                });
            });
            
            $rootScope.$on('PushEventSvc.Lost_Connection', function() {
                alert('Lost Connection');
            });
            
            $rootScope.updateCurrentRoom = function () {
                var ids = MeetingSvc.findAllIds();
                if ($rootScope.currentUser && $rootScope.currentUser.roles.indexOf('ROLE_HOST') >= 0 && ids.length > 0) {
                    $rootScope.context.room = MeetingSvc.findRoom(ids[0]);
                } else {
                    $rootScope.context.room = null;
                }
            };

            AutoCommentRequestCancelSvc.start();
        })

        .config(function ($stateProvider, $urlRouterProvider, blacktigerProvider, CONFIG) {
            if (CONFIG.serviceUrl) {
                blacktigerProvider.setServiceUrl(CONFIG.serviceUrl);
            }
            $stateProvider
                    .state('signin', {
                        url: '/signin',
                        templateUrl: 'templates/sign-in.html',
                        controller: 'SignInCtrl'
                    })

                    // setup an abstract state for the tabs directive
                    .state('tab', {
                        url: "/tab",
                        abstract: true,
                        templateUrl: "templates/tabs.html"
                    })

                    // Each tab has its own nav history stack:

                    .state('tab.comments', {
                        url: '/comments',
                        views: {
                            'tab-comments': {
                                templateUrl: 'templates/tab-comments.html',
                                controller: 'CommentsCtrl'
                            }
                        }
                    })
                    
                    .state('tab.settings', {
                        url: '/settings',
                        views: {
                            'tab-settings': {
                                templateUrl: 'templates/tab-settings.html',
                                controller: 'SettingsCtrl'
                            }
                        }
                    })

                    .state('tab.stopwatch', {
                        url: '/stopwatch',
                        views: {
                            'tab-stopwatch': {
                                templateUrl: 'templates/tab-stopwatch.html',
                                controller: 'StopwatchCtrl'
                            }
                        }
                    });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/tab/comments');

        });

/** BOOTSTRAP **/
angular.element(document).ready(function () {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('config.json').then(
            function (response) {
                var config = response.data;
                blacktigerApp.constant('CONFIG', config);
                angular.bootstrap(document, ['blacktiger-podium']);
            }
    );

});