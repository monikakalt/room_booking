'use strict';

angular
    .module('app')
    .factory('EquipmentService', EquipmentService);

function EquipmentService($rootScope, $http) {
    var service = {};

    service.GetAllEquipment = GetAllEquipment;
    service.GetEquipment = GetEquipment;
    service.EditEquipment = EditEquipment;
    service.AddEquipment = AddEquipment;
    service.DeleteEquipment = DeleteEquipment;
    service.GetEquipmentEnums = GetEquipmentEnums;
    service.GetEquipmentByBuilding = GetEquipmentByBuilding;
    service.GetEquipmentByBuildingAndReservation = GetEquipmentByBuildingAndReservation;
    service.GetEquipmentByReservation = GetEquipmentByReservation;

    return service;

    function GetAllEquipment() {
        var promise = $http.get('http://localhost:8000/getAllEquipment', { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetEquipmentEnums() {
        var promise = $http.get('http://localhost:8000/getEquipmentEnums', { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetEquipment(equipmentID) {
        var promise = $http.get('http://localhost:8000/equipment/' + equipmentID, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function EditEquipment(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/editEquipment',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            });
        }
    }

    function AddEquipment(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/addEquipment',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            });
        }
    }

    function DeleteEquipment(obj) {
        if (obj != null) {
            $http({
                method: 'DELETE',
                url: 'http://localhost:8000/deleteEquipment',
                data: $.param(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }

    function GetEquipmentByBuilding(buildingId, StartTime, EndTime) {
        var promise = $http.get('http://localhost:8000/getAvailableEquipmentInBuilding/' + buildingId + '/' + StartTime + '/' + EndTime, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetEquipmentByBuildingAndReservation(buildingId, reservationId, StartTime, EndTime) {
        var promise = $http.get('http://localhost:8000/getAvailableEquipmentInBuildingAndReservation/' + buildingId + '/' + reservationId + '/' + StartTime + '/' + EndTime, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetEquipmentByReservation(id) {
        var promise = $http.get('http://localhost:8000/getEquipmentByReservationId/' + id, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }
}