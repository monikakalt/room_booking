(function () {
    'use strict';

    angular.module('app').controller('LoginController', LoginController);
    function LoginController($location, FlashService, UniversalService, $scope, $window, $rootScope, $log,$cookies, $http, $routeParams) {

        var vm = this;

        $scope.forgot = function (username, email) {
            if (username != null) {
                var obj = {
                    "username": username,
                    "email": email
                }
            }
            var Results = UniversalService.PostForgot(obj);
        };

        $scope.save = function (username, password) {
            vm.dataLoading = true;
            var obj = {
                username: username,
                password: password
            };
            UniversalService.Login(obj, function (response) {
                if (response.data.api_token !== undefined) {
                    $cookies.put('User', response.data.api_token);
                    $http.defaults.headers.common['Authorization'] = response.data.api_token;
                    window.location.href = '#!/main';
                    window.location.reload();
                } else {
                    FlashService.Error(response.status);
                }
            });
        };

        $scope.saveVerify = function (username, email) {
            var obj = {
                username: username,
                email: email
            };
            UniversalService.SendEmail(obj);
            $scope.alert = "true";
        }

        $scope.changePassword = function (newPassword, oldPassword) {
            var obj = {
                newPassword: newPassword,
                oldPassword: oldPassword,
                verify: $routeParams.id
            };
            UniversalService.ChangePassword(obj);
            $location.path('/login');
        }
    }
})();
