//naujas main
'use strict';

angular.module('app').controller('MainController', MainController);

function MainController(EditService, $location, UniversalService, $scope, $sce, $rootScope, $mdDialog, $cookies, $window, $compile, uiCalendarConfig, $timeout, $uibModal, $filter, $uibModalStack) {
    $scope.eventSources = [];
    $scope.Info = [];
    $scope.arrayReservations = [];
    $scope.equipmentByReservation = [];
    $scope.reservation_equip = [];
    $scope.reservationInfoById = [];
    loadUserInformation();

    var authData = [];

    function loadUserInformation() {
        UniversalService.GetUserInformation()
            .then(function (a) {
                $scope.userInformation = a;
            });
    }

    UniversalService.AuthenticateUser()
        .then(function (data) {
            authData = data;
            $scope.isAdmin = data['is_admin'];
            if ($scope.isAdmin == true) {
                loadAllCities();
                formEvents();
            } else {
                loadCities();
                formEvents();
            }
        });

    function loadAllReservations(callback) {
        UniversalService.GetReservations()
            .then(function (response) {
                $scope.userReservations = response;
                if (callback) {
                    callback(response);

                }
            });
    }

    function loadUserReservations(callback) {
        UniversalService.GetUserReservations()
            .then(function (response) {
                $scope.userReservations = response;
                if (callback) {
                    callback(response);
                }
            });
    }

    function loadAllCities() {
        UniversalService.GetCities()
            .then(function (a) {
                $scope.cities = a;
            });
    }

    function loadCities() {
        UniversalService.GetUserCities()
            .then(function (a) {
                $scope.cities = a;
            });
    }

    function EquipmentByReservation(id) {
        UniversalService.GetEquipmentByReservation(id)
            .then(function (eq) {
                $scope.equipmentByReservation = eq;
            });
    }

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    //ATOSTOGU DIENOMS RAST API
    $scope.eventSource = {
        // url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
        className: 'gcal-event',           // an option!
        currentTimezone: 'America/Chicago' // an option!
    };

    function formEventsData(response) {
        uiCalendarConfig.calendars['myCalendar3'].fullCalendar('removeEvents');
        $scope.arrayReservations = [];
        if (response) {
            for (var i = 0; i < response.length; i++) {
                if ($scope.userInformation[0].id == response[i].user_id) {
                    var obj = {
                        id: response[i].id,
                        city_name: response[i].city_name,
                        title: 'Room: ' + response[i].room_nr,
                        room: response[i].room_id,
                        start: response[i].start_date,
                        end: response[i].end_date,
                        color: '#FF6000'
                    };
                }
                else {
                    var obj = {
                        id: response[i].id,
                        city_name: response[i].city_name,
                        title: 'Room: ' + response[i].room_nr,
                        room: response[i].room_id,
                        start: response[i].start_date,
                        end: response[i].end_date,
                        color: '#336699'
                    };
                }
                $scope.arrayReservations.push(obj);
            }
        }
        var eventSources = $scope.arrayReservations;
        uiCalendarConfig.calendars['myCalendar3'].fullCalendar('addEventSource', eventSources);
        eventSources = null;
    }



    function formEvents() {
        if (!$scope.isAdmin) {
            if ($scope.cityId === "" || $scope.cityId === undefined) {
                loadUserReservations(function (response) {
                    formEventsData(response);
                });
            } else if ($scope.buildingId !== "") {
                loadUserReservationsByCityAndAddress(function (response) {
                    formEventsData(response);
                });
            } else {
                loadUserReservationsByCity(function (response) {
                    formEventsData(response);
                });
            }
        } else {
            if ($scope.cityId === "" || $scope.cityId === undefined) {
                loadAllReservations(function (response) {
                    formEventsData(response);
                });
            } else if ($scope.buildingId !== "") {
                loadAllReservationsByCityAndAddress(function (response) {
                    formEventsData(response);
                });
            } else {
                loadAllReservationsByCity(function (response) {
                    formEventsData(response);
                });
            }
        }
    }

    //-------------FILTER------------------------
    $scope.SelectedCity = function (city) {
        $scope.cityId = "";
        $scope.buildingId = "";
        if (city === null) {
            $scope.buildingStatus = "false";
            formEvents();
            return;
        }
        else {
            for (var i = 0; i < $scope.cities.length; i++) {
                if (city == $scope.cities[i].city_name) {
                    $scope.cityId = $scope.cities[i].id;
                }
            }
            $scope.buildingStatus = "true";
        }
        if ($scope.isAdmin) {
            loadAllBuildingsByCity();
        } else {
            loadBuildings();
        }
        formEvents();
    }

    function loadBuildings() {
        UniversalService.GetUserBuildingsByCity($scope.cityId)
            .then(function (a) {
                $scope.cityBuildings = a;
            });
    }

    function loadAllBuildingsByCity() {
        UniversalService.GetAllBuildingsByCity($scope.cityId)
            .then(function (a) {
                $scope.cityBuildings = a;
            });
    }

    $scope.setSelectedBuilding = function (building) {
        if (building !== null) {
            for (var i = 0; i < $scope.cityBuildings.length; i++) {
                if (building == $scope.cityBuildings[i].address) {
                    $scope.buildingId = $scope.cityBuildings[i].id;
                    formEvents();
                }
            }
        }
        else {
            $scope.buildingId = "";
            formEvents();
        }

    }

    function loadUserReservationsByCity(callback) {
        UniversalService.GetUserReservationsByCity($scope.cityId)
            .then(function (response) {
                $scope.userReservationsByCity = response;
                if (callback) {
                    callback(response);
                }
            });
    }

    function loadUserReservationsByCityAndAddress(callback) {
        UniversalService.GetUserReservationsByCityAndBuilding($scope.cityId, $scope.buildingId)
            .then(function (response) {
                $scope.userReservationsByCityAndBuilding = response;
                if (callback) {
                    callback(response);
                }
            });
    }

    function loadAllReservationsByCityAndAddress(callback) {
        UniversalService.GetAllReservationsByCityAndBuilding($scope.cityId, $scope.buildingId)
            .then(function (response) {
                $scope.userReservationsByCityAndBuilding = response;
                if (callback) {
                    callback(response);
                }
            });
    }


    function loadAllReservationsByCity(callback) {
        UniversalService.GetAllReservationsByCity($scope.cityId)
            .then(function (response) {
                $scope.userReservationsByCity = response;
                if (callback) {
                    callback(response);
                }
            });
    }

    //-----------------------------------------------------------
    $scope.delete = function (id) {
        var obj = {
            id: id
        };
        UniversalService.RemoveReservation(obj)
            .then(function () {
                formEvents();
            });
        $scope.modalInstance.close();
    };

    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = $scope.arrayReservations;
        callback(events);
    };


    /* alert on eventClick */
    $scope.alertOnEventClick = function (obj, jsEvent, view) {
        for (var i = 0; i < $scope.userReservations.length; i++) {
            if (obj.id == $scope.userReservations[i].id) {
                $scope.Info = $scope.userReservations[i];
            }
        }
        var id = $scope.Info.id;
        EquipmentByReservation(id);
        $scope.openReservationInfo();
    };

    /* Change View */
    $scope.changeView = function (view, calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalender = function (calendar) {
        if (uiCalendarConfig.calendars[calendar]) {
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };

    /* config object */
    $scope.uiConfig = {
        calendar: {
            height: 450,
            header: {
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            minTime: '7:00',
            maxTime: '20:00',
            weekends: false,
            timeFormat: 'H(:mm)',
            editable: false,
            time: true,
            // allDay: true,
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventSources: [formEvents('myCalendar3', 'All')],
            eventRender: $scope.eventRender,
            eventLimit: true, // for all non-agenda views
            views: {
                agenda: {
                    eventLimit: 5 // adjust to 6 only for agendaWeek/agendaDay
                },
                month: {
                    eventLimit: 5
                }
            }
        }
    };


    /* event sources array*/
    //$scope.eventSources = [$scope.arrayReservations, $scope.eventSource, $scope.eventsF];
    //---------EDIT RemoveReservation
    $scope.toggle = function (id) {debugger;

        EditService.open(id)
            .then(function () {
                formEvents();
            });

        $scope.modalInstance.close();
    };

    $scope.openReservationInfo = function (size) {debugger;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'ReservationInfoModal.html',
            controller: 'ReservationInfoModal',
            size: size,
            scope: $scope,
        });
    }
}



angular.module('app').controller('ReservationInfoModal', function ($scope, $uibModalInstance, UniversalService) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});