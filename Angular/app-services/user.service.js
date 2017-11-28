'use strict';

angular
    .module('app')
    .factory('UserService', UserService);

function UserService($rootScope, $http, $q, FlashService) {
    var service = {};
    var isAdmin = "";

    service.GetUsers = GetUsers;
    service.GetUser = GetUser;
    service.EditUser = EditUser;
    service.AddUser = AddUser;
    service.DeleteUser = DeleteUser;
    service.GetUserInformation = GetUserInformation;
    service.AuthenticateUser = AuthenticateUser;
    service.GetIsAdmin = GetIsAdmin;
    service.FilterUsersByFirstName = FilterUsersByFirstName;
    service.FilterUsersByLastName = FilterUsersByLastName;
    service.FilterUsersByPosition = FilterUsersByPosition;
    service.FilterUsersByCity = FilterUsersByCity;


    return service;

    function GetUsers() {
        var promise = $http.get('http://localhost:8000/getUsers', { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function GetUser(userID) {
        var promise = $http.get('http://localhost:8000/user/' + userID, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function EditUser(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/editUser',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).then(function () {
            }, function (response) {debugger;
                var data = [];
                for (var key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        data = data + " " + response.data[key][0];
                    }
                }
                FlashService.Error(data);
            });
        }
    }

    function AddUser(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/addUser',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).then(function () {
            }, function (response) {debugger;
                var data = [];
                for (var key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        data = data + " " + response.data[key][0];
                    }
                }
                FlashService.Error(data);
            });
        }
    }

    function DeleteUser(obj) {
        if (obj != null) {
            $http({
                method: 'DELETE',
                url: 'http://localhost:8000/deleteUser',
                data: $.param(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }

    function GetUserInformation() {
        var promise = $http.get('http://localhost:8000/getUserInformation', { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function AuthenticateUser() {
        return $http.get('http://localhost:8000/authenticateUser', { cache: false }).then(function (response) {
            //  var promise = $http.get('http://localhost:8000/authenticateUser', {cache: false}).then(function(response){
            return response.data;
        });
        // var promise = $http.get('http://localhost:8000/authenticateUser', {cache: false}).then(function(response){
        //     return response.data;
        // });
        // return promise;
    }

    function GetIsAdmin() {
        return isAdmin;
    }

    function FilterUsersByFirstName(firstName) {
        var promise = $http.get('http://localhost:8000/filterUsersByFirstName/' + firstName, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function FilterUsersByLastName(lastName) {
        var promise = $http.get('http://localhost:8000/filterUsersByLastName/' + lastName, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function FilterUsersByPosition(position) {
        var promise = $http.get('http://localhost:8000/filterUsersByPosition/' + position, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

    function FilterUsersByCity(city) {
        var promise = $http.get('http://localhost:8000/filterUsersByCity/' + city, { cache: false }).then(function (response) {
            return response.data;
        });
        return promise;
    }

}
