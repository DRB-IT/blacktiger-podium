angular.module('blacktiger-podium.controllers', [])

        .controller('SignInCtrl', function ($scope, $state, LoginSvc) {

            $scope.signIn = function (user) {
                console.log('Sign In', user);
                
                LoginSvc.authenticate(user.username, user.password, false).then(function () {
                    $scope.status = 'success';
                }, function (reason) {
                    $scope.status = "invalid";
                });
            };

        })

        .controller('CommentsCtrl', function ($scope, MeetingSvc, $log) {
            $scope.isShown = function(value, index) {
                return value.host === false && (value.commentRequested || !value.muted);
            }
        })

        .controller('StopwatchCtrl', function ($scope) {

        })
