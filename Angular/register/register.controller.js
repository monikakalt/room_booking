(function () {

    'use strict';

    angular.module('app').controller('RegisterController', RegisterController);

    function RegisterController($location, FlashService, UniversalService, $scope, $sce, $rootScope, $log, $mdDialog, $cookies, $http, $routeParams) {

        var vm = this;
        $scope.register = function (full_name, email, position, employment_date, birth_date, city, address) {
            if (full_name != null) {
                var obj = {
                    "full_name": full_name,
                    "email": email,
                    "position": position,
                    "employment_date": employment_date,
                    "address": address,
                    "birth_date": birth_date,
                    "city": city
                }
            }
            UniversalService.PostRegister(obj);
        };
    }
})();
