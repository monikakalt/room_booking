'use strict';

angular
    .module('app')
    .factory('CityService', CityService);

function CityService($rootScope, $http) {
    var service = {};

    service.GetCities = GetCities;
    service.GetCity = GetCity;
    service.EditCity = EditCity;
    service.AddCity = AddCity;
    service.DeleteCity = DeleteCity;
    service.GetUserCities = GetUserCities;

    return service;

    function GetCities() {
        var promise = $http.get('http://localhost:8000/getCities', { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetCity(cityID) {
        var promise = $http.get('http://localhost:8000/city/' + cityID, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function EditCity(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/editCity',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            });
        }
    }

    function AddCity(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/addCity',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            });
        }
    }

    function DeleteCity(obj) {
        if (obj != null) {
            $http({
                method: 'DELETE',
                url: 'http://localhost:8000/deleteCity',
                data: $.param(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }

    function GetUserCities() {
        var promise = $http.get('http://localhost:8000/filterCitiesByUser', { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }
}