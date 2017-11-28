angular.module('app').factory('UniversalService', UniversalService);
function UniversalService($http, $q, $location, FlashService, $window, $rootScope, $cookies,
    ReservationService, CityService, BuildingService, RoomService, EquipmentService, UserService) {
    var service = {};
    var vm = this;

    service.Login = Login;
    service.PostRegister = PostRegister;

    service.SendEmail = SendEmail;
    service.ChangePassword = ChangePassword;

    service.ClearCredentials = ClearCredentials;

    service.GetCities = CityService.GetCities;
    service.GetCity = CityService.GetCity;
    service.EditCity = CityService.EditCity;
    service.AddCity = CityService.AddCity;
    service.DeleteCity = CityService.DeleteCity;
    service.GetUserCities = CityService.GetUserCities;

    service.GetBuildings = BuildingService.GetBuildings;
    service.GetAllBuildingsByCity = BuildingService.GetAllBuildingsByCity;
    service.GetBuilding = BuildingService.GetBuilding;
    service.EditBuilding = BuildingService.EditBuilding;
    service.AddBuilding = BuildingService.AddBuilding;
    service.DeleteBuilding = BuildingService.DeleteBuilding;
    service.GetUserBuildingsByCity = BuildingService.GetUserBuildingsByCity;

    service.GetRooms = RoomService.GetRooms;
    service.GetRoom = RoomService.GetRoom;
    service.EditRoom = RoomService.EditRoom;
    service.AddRoom = RoomService.AddRoom;
    service.DeleteRoom = RoomService.DeleteRoom;
    service.GetRoomsByCity = RoomService.GetRoomsByCity;
    service.GetRoomsByBuilding = RoomService.GetRoomsByBuilding;
    service.GetRoomsByBuildingAndReservation = RoomService.GetRoomsByBuildingAndReservation;

    service.GetAllEquipment = EquipmentService.GetAllEquipment;
    service.GetEquipment = EquipmentService.GetEquipment;
    service.EditEquipment = EquipmentService.EditEquipment;
    service.AddEquipment = EquipmentService.AddEquipment;
    service.DeleteEquipment = EquipmentService.DeleteEquipment;
    service.GetEquipmentEnums = EquipmentService.GetEquipmentEnums;
    service.GetEquipmentByBuilding = EquipmentService.GetEquipmentByBuilding;
    service.GetEquipmentByBuildingAndReservation = EquipmentService.GetEquipmentByBuildingAndReservation;
    service.GetEquipmentByReservation = EquipmentService.GetEquipmentByReservation;

    service.GetUsers = UserService.GetUsers;
    service.GetUser = UserService.GetUser;
    service.EditUser = UserService.EditUser;
    service.AddUser = UserService.AddUser;
    service.DeleteUser = UserService.DeleteUser;
    service.GetUserInformation = UserService.GetUserInformation;
    service.AuthenticateUser = UserService.AuthenticateUser;

    service.GetIsAdmin = UserService.GetIsAdmin;
    service.FilterUsersByFirstName = UserService.FilterUsersByFirstName;
    service.FilterUsersByLastName = UserService.FilterUsersByLastName;
    service.FilterUsersByPosition = UserService.FilterUsersByPosition;
    service.FilterUsersByCity = UserService.FilterUsersByCity;

    service.PostReservation = ReservationService.PostReservation;
    service.RemoveReservation = ReservationService.RemoveReservation;
    service.EditReservation = ReservationService.EditReservation;
    service.GetReservations = ReservationService.GetReservations;
    service.GetUserReservations = ReservationService.GetUserReservations;
    service.GetUserReservationsByUserID = ReservationService.GetUserReservationsByUserID;
    service.GetUserReservationsByCity = ReservationService.GetUserReservationsByCity;
    service.GetAllReservationsByCity = ReservationService.GetAllReservationsByCity;
    service.GetUserReservationsByCityAndBuilding = ReservationService.GetUserReservationsByCityAndBuilding;
    service.GetUserReservationsByCityAndBuildingAndUserID = ReservationService.GetUserReservationsByCityAndBuildingAndUserID;
    service.GetAllReservationsByCityAndBuilding = ReservationService.GetAllReservationsByCityAndBuilding;
    service.GetReservationsByCityUserID = ReservationService.GetReservationsByCityUserID;

    return service;

    function Login(obj, callback) {
        $http({
            method: 'POST',
            url: 'http://localhost:8000/login',
            data: $.param(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            if (response.data.status === "success") {
                callback(response);
            }
        }, function (response) {
            FlashService.Error(response.data.status);
        });
    }

    function PostRegister(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/register',
                data: $.param(obj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).then(function (response) {
                if (response.data.status == "Registered") {
                    FlashService.Success(response.data.status);
                }
                else {
                    FlashService.Error(response.data.status);
                }
            });
        }
    }

    function SendEmail(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/forgot',
                data: $.param(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }

    function ChangePassword(obj) {
        if (obj != null) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/forgot/' + obj[Object.keys(obj)[2]],
                data: $.param(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }

    function SetCredentials(password) {
        var authdata = Base64.encode(password);
        $rootScope.User = {
            currentUser: {
                authdata: authdata
            }
        };
        $http.defaults.headers.common['Authorization'] = $cookies.get('User');
        var cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 7);
        $cookies.putObject('User', $rootScope.User, { expires: cookieExp });
        return authdata;
    }

    function ClearCredentials() {
        var obj = {
            token: $rootScope.User};
        debugger;
         $http({
            method: 'POST',
            url: 'http://localhost:8000/deleteToken',
            data: $.param(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        $rootScope.User = {};
        $cookies.remove('User');
        $http.defaults.headers.common.Authorization = 'Basic';
    }

}