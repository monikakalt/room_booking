'use strict';
angular
    .module('app')
    .factory('EditService', EditService);

function EditService(UniversalService, $uibModal, $rootScope, $http) {
    var service = {};
    service.open = open;
    service.GetInformationByReservation = GetInformationByReservation;
    return service;

    function open(id) {
        var promise = 0;
        var modalInstance = $uibModal.open({
            templateUrl: 'edit/edit.view.html',
            controller: 'EditController',
            scope: $rootScope,
        });
        $rootScope.reservation_id = id;
        return modalInstance.result.then(function () {}, function(){});
    }

    function GetInformationByReservation(id) {
        var promise = $http.get('http://localhost:8000/getInformationByReservationId/' + id, { cache: false })
            .then(function (response) {
                return response.data;
        });
        return promise;
    }
}