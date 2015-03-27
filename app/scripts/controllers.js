angular.module('blacktiger-podium.controllers', [])

        .controller('SignInCtrl', function ($scope, $state, LoginSvc) {

            $scope.signIn = function (user) {
                console.log('Sign In', user);

                LoginSvc.authenticate(user.username, user.password, true).then(function () {
                    $scope.status = 'success';
                    user.username = '';
                    user.password = '';
                }, function (reason) {
                    $scope.status = "invalid";
                });
            };

        })

        .controller('CommentsCtrl', function ($scope, MeetingSvc, $log) {
            $scope.isShown = function (value, index) {
                return value.host === false && (value.commentRequested || !value.muted);
            }
        })
        
        .controller('SettingsCtrl', function ($scope, LoginSvc) {
            $scope.logout = function () {
                LoginSvc.deauthenticate();
            }
            
            
        })

        .controller('StopwatchCtrl', function ($scope, $interval) {
            $scope.state = 'idle';
            $scope.startTime = null;
            $scope.elapsedTime = 0;

            $scope.update = function () {
                var now = new Date();
                $scope.elapsedTime = now.getTime() - $scope.startTime.getTime();
            };

            $scope.toggle = function () {
                if ($scope.state === 'idle') {
                    $scope.state = 'started';
                    $scope.startTime = new Date();
                    $scope.updateInterval = $interval($scope.update, 100);
                } else {
                    $scope.state = 'idle';
                    $scope.startTime = null;
                    $interval.cancel($scope.updateInterval);
                }
            };

            $scope.$on('destroy', function () {
                $interval.cancel($scope.updateInterval);
            });
        }).filter('time', function () {
            var padNumber = function(input) {
                return input < 10 ? '0' + input : input;
            };
            
            return function (input, start, stop) {
                if(!start) {
                    start = 0;
                }
                
                if(!stop) {
                    stop = 3;
                }
                
                if (angular.isNumber(input)) {

                    var elapsed = input, elements = [], i, result = '';
                    elements[0] = parseInt(elapsed / 3600000, 10);
                    elapsed %= 3600000;
                    elements[1] = parseInt(elapsed / 60000, 10);
                    elapsed %= 60000;
                    elements[2] = parseInt(elapsed / 1000, 10);
                    elements[3] = elapsed % 1000;

                    for(i=start;i<=stop;i++) {
                        result += padNumber(elements[i]);
                        if(i<stop) result+= ':';
                    }
                    
                    return result;
                }
            };
        });

