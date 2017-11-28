'use strict';

angular
    .module('app')
    .factory('BuildingService', BuildingService);

function BuildingService($rootScope, $http) {
    var service = {};

    service.GetBuildings = GetBuildings;
    service.GetAllBuildingsByCity = GetAllBuildingsByCity;
    service.GetBuilding = GetBuilding;
    service.EditBuilding = EditBuilding;
    service.AddBuilding = AddBuilding;
    service.DeleteBuilding = DeleteBuilding;
    service.GetUserBuildingsByCity = GetUserBuildingsByCity;

    return service;

    function GetBuildings() {
        var promise = $http.get('http://localhost:8000/getBuildings', { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetAllBuildingsByCity(cityId) {
        var promise = $http.get('http://localhost:8000/getBuildingsByCity/' + cityId, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetBuilding(buildingID) {
        var promise = $http.get('http://localhost:8000/building/' + buildingID, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function EditBuilding(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/editBuilding',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            });
        }
    }

    function AddBuilding(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/addBuilding',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            });
        }
    }

    function DeleteBuilding(obj) {
        if (obj != null) {
            $http({
                method: 'DELETE',
                url: 'http://localhost:8000/deleteBuilding',
                data: $.param(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }

    function GetUserBuildingsByCity(cityId) {
        var promise = $http.get('http://localhost:8000/filterBuildingsByCity/' + cityId, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }
}