'use strict';

angular
    .module('app')
    .factory('ReservationService', ReservationService);

function ReservationService($rootScope, $http) {
    var service = {};

    service.PostReservation = PostReservation;
    service.RemoveReservation = RemoveReservation;
    service.EditReservation = EditReservation;
    service.GetReservations = GetReservations;
    service.GetUserReservations = GetUserReservations;
    service.GetUserReservationsByCity = GetUserReservationsByCity;
    service.GetAllReservationsByCity = GetAllReservationsByCity;
    service.GetUserReservationsByCityAndBuilding = GetUserReservationsByCityAndBuilding;
    service.GetUserReservationsByCityAndBuildingAndUserID = GetUserReservationsByCityAndBuildingAndUserID;
    service.GetAllReservationsByCityAndBuilding = GetAllReservationsByCityAndBuilding;
    service.GetUserReservationsByUserID = GetUserReservationsByUserID;
    service.GetReservationsByCityUserID = GetReservationsByCityUserID;

    return service;

    function RemoveReservation(obj) {
        if (obj != null) {
            var promise = $http({
                method: 'DELETE',
                url: 'http://localhost:8000/removeReservation',
                data: $.param(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                return response;
            });
            return promise;
        }
    }

    function EditReservation(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/editReservation',
                data: $.param(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }

    function PostReservation(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/reserve',
                data: $.param(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }

    function GetReservations() {
        var promise = $http.get('http://localhost:8000/getReservationTable', { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetUserReservations() {
        var promise = $http.get('http://localhost:8000/getUserReservations', { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetUserReservationsByUserID(userID) {
        var promise = $http.get('http://localhost:8000/getUserReservationsByID/'+ userID, {cache: false}).then(function(response){
            return response.data;
        });
        return promise;
    }

    function GetUserReservationsByCity(cityId){
        var promise = $http.get('http://localhost:8000/filterReservationsByCity/' + cityId, {cache: false}).then(function(response){
            return response.data;
        });
        return promise;
    }

    function GetReservationsByCityUserID(cityId, userId){
        var promise = $http.get('http://localhost:8000/filterUserReservationsByCity/' + cityId + '/' + userId, {cache: false}).then(function(response){
            return response.data;
        });
        return promise;
    }

    function GetAllReservationsByCity(cityId) {
        var promise = $http.get('http://localhost:8000/filterAllReservationsByCity/' + cityId, { cache: false }).then(function (response) {

            return response.data;
        });
        return promise;
    }

    function GetUserReservationsByCityAndBuilding(cityId, buildingId) {
        var promise = $http.get('http://localhost:8000/filterReservationsByCityAndBuilding/' + cityId + '/' + buildingId, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetUserReservationsByCityAndBuildingAndUserID(cityId, buildingId, userId) {
        var promise = $http.get('http://localhost:8000/filterUserReservationsByCityAndBuilding/' + cityId + '/' + buildingId + '/' + userId,
            { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetAllReservationsByCityAndBuilding(cityId, buildingId) {
        var promise = $http.get('http://localhost:8000/filterAllReservationsByCityAndBuilding/' + cityId + '/' + buildingId, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }
}