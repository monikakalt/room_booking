'use strict';

angular
    .module('app')
    .factory('RoomService', RoomService);

function RoomService($rootScope, $http) {
    var service = {};

    service.GetRooms = GetRooms;
    service.GetRoom = GetRoom;
    service.EditRoom = EditRoom;
    service.AddRoom = AddRoom;
    service.DeleteRoom = DeleteRoom;
    service.GetRoomsByCity = GetRoomsByCity;
    service.GetRoomsByBuilding = GetRoomsByBuilding;
    service.GetRoomsByBuildingAndReservation = GetRoomsByBuildingAndReservation;

    return service;

    function GetRooms() {
        var promise = $http.get('http://localhost:8000/getRooms', { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetRoom(roomID) {
        var promise = $http.get('http://localhost:8000/room/' + roomID, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function EditRoom(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/editRoom',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            });
        }
    }

    function AddRoom(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/addRoom',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            });
        }
    }

    function DeleteRoom(obj) {
        if (obj != null) {
            $http({
                method: 'DELETE',
                url: 'http://localhost:8000/deleteRoom',
                data: $.param(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }

    function GetRoomsByCity(cityId, StartTime, EndTime) {
        var promise = $http.get('http://localhost:8000/getAvailableRoomsInCity/' + cityId + '/' + StartTime + '/' + EndTime, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetRoomsByBuilding(buildingId, StartTime, EndTime) {
        var promise = $http.get('http://localhost:8000/getAvailableRoomsInBuilding/' + buildingId + '/' + StartTime + '/' + EndTime, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetRoomsByBuildingAndReservation(buildingId, reservationId, StartTime, EndTime) {
        var promise = $http.get('http://localhost:8000/getAvailableRoomsInBuildingAndReservation/' + buildingId + '/' + reservationId + '/' + StartTime + '/' + EndTime, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }
}