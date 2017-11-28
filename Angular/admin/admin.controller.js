(function () {
    'use strict';

    angular.module('app').controller('AdminController', AdminController);

    function AdminController($location, FlashService, UniversalService, $scope, $sce, $rootScope, $mdDialog, $cookies, $uibModal, $filter, EditService) {
        var vm = this;

        $scope.userInformation = [];
        $scope.user= {};
        $scope.buildings = [];
        $scope.rooms = [];
        $scope.equipments = [];
        $scope.users = [];
        $scope.cities = [];
        $scope.inputRequired = true;
        $scope.animationsEnabled = true;
        $scope.reservations = [];

        $scope.adminSelectList = [
            { key: "0", text: "Not admin" },
            { key: "1", text: "Admin" },
        ];

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.filteredCities = [],
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.maxSize = 5;

        $scope.loadCities = function (callback) {
            UniversalService.GetCities()
                .then(function (data) {
                    if (data && data.length > 0) {
                        $scope.cities = data;
                    }
                    if (callback) {
                        callback(data);
                    }
                });
        };


        function loadCities(callback) {
            UniversalService.GetCities()
                .then(function (response) {
                    if (response && response.length > 0) {
                        $scope.cities = response;
                    }
                    if (callback) {
                        callback(response);
                    }
                });
        }

        $scope.$watchCollection('cities', function(newValue,oldValue) {
          if(oldValue!=newValue){
              $scope.filteredCities =newValue;
              $scope.cities=$scope.filteredCities;
          }
          var begin = (($scope.currentPage - 1) * $scope.numPerPage),
              end = begin + $scope.numPerPage;
          $scope.filteredCities = $scope.cities.slice(begin, end);

        },true);

        $scope.$watchCollection('buildings', function(newValue,oldValue) {
          if(oldValue!=newValue){
              $scope.filteredBuildings =newValue;
          }
          var begin = (($scope.currentPage - 1) * $scope.numPerPage),
              end = begin + $scope.numPerPage;
          $scope.filteredBuildings = $scope.buildings.slice(begin, end);
        },true);

        $scope.$watchCollection('rooms', function(newValue,oldValue) {
          if(oldValue!=newValue){
              $scope.filteredRooms =newValue;
          }
          var begin = (($scope.currentPage - 1) * $scope.numPerPage),
              end = begin + $scope.numPerPage;
          $scope.filteredRooms = $scope.rooms.slice(begin, end);
        },true);

        $scope.$watchCollection('equipments', function(newValue,oldValue) {
          if(oldValue!=newValue){
              $scope.filteredEquipments =newValue;debugger;
          }
          var begin = (($scope.currentPage - 1) * $scope.numPerPage),
              end = begin + $scope.numPerPage;
          $scope.filteredEquipments = $scope.equipments.slice(begin, end);
        },true);

        $scope.$watchCollection('users', function(newValue,oldValue) {
          if(oldValue!=newValue){
              $scope.filteredUsers =newValue;
          }
          var begin = (($scope.currentPage - 1) * $scope.numPerPage),
              end = begin + $scope.numPerPage;
          $scope.filteredUsers = $scope.users.slice(begin, end);
        },true);

        $scope.$watch('currentPage + numPerPage', function () {
            $scope.loadCities(function (data) {
                if (data) {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                        end = begin + $scope.numPerPage;
                    $scope.filteredCities = $scope.cities.slice(begin, end);debugger;
                }
            })
            $scope.loadBuildings(function (data) {
                if (data) {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                        end = begin + $scope.numPerPage;
                    $scope.filteredBuildings = $scope.buildings.slice(begin, end);
                }
            })
            $scope.loadRooms(function (data) {
                if (data) {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                        end = begin + $scope.numPerPage;
                    $scope.filteredRooms = $scope.rooms.slice(begin, end);
                }
            })
            $scope.loadUsers(function (data) {
                if (data) {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                        end = begin + $scope.numPerPage;
                    $scope.filteredUsers = $scope.users.slice(begin, end);
                }
            })
            $scope.loadEquipment(function (data) {
                if (data) {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                        end = begin + $scope.numPerPage;
                    $scope.filteredEquipments = $scope.equipments.slice(begin, end);
                }
            })
        });


        $scope.changeView = function (view) {
            $location.path(view);
        };



        $scope.loadBuildings = function (callback) {
            UniversalService.GetBuildings()
                .then(function (data) {
                    if (data && data.length > 0) {
                        $scope.buildings = data;
                    }
                    if (callback) {
                        callback(data);
                    }
                });
            $scope.loadCities();
        };

        $scope.loadRooms = function (callback) {
            UniversalService.GetRooms()
                .then(function (data) {
                    if (data && data.length > 0) {
                        $scope.rooms = data;
                    }
                    if (callback) {
                        callback(data);
                    }
                });
            $scope.loadCities();
        };

        $scope.loadEquipment = function (callback) {
            UniversalService.GetAllEquipment()
                .then(function (data) {
                    if (data && data.length > 0) {
                        $scope.equipments = data;
                    }
                    if (callback) {
                        callback(data);
                    }
                });
            $scope.loadCities();
            UniversalService.GetEquipmentEnums()
                .then(function (data) {
                    if (data && data.length > 0) {
                        $scope.enums = data;
                    }
                });
            $scope.selectedEnum = "";
        };

        $scope.loadUsers = function (callback) {
            UniversalService.GetUsers()
                .then(function (data) {
                    if (data && data.length > 0) {
                        $scope.users = data;
                    }
                    if (callback) {
                        callback(data);
                    }
                });
        };

        $scope.loadUserReservationsByUserID = function (id){
            UniversalService.GetUserReservationsByUserID(id)
                .then (function (data) {
                    $scope.user.id = id;
                    $scope.reservations = data;
                });
        };

        $scope.loadUserReservationsByCityUserID = function (id){
            UniversalService.GetReservationsByCityUserID($scope.cityId, id)
                .then (function (data) {
                    $scope.reservations = data;
                });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };


        $scope.setSelectedCity = function (city) {
            $scope.cityId = "";
            for (var i = 0; i < $scope.cities.length; i++) {
                if (city == $scope.cities[i].city_name) {
                    $scope.cityId = $scope.cities[i].id;
                }
            }
        }

        $scope.setSelectedBuilding = function (building) {
            $scope.buildingId = "";
            for (var i = 0; i < $scope.buildings.length; i++) {
                if (building == $scope.buildings[i].address) {
                    $scope.buildingId = $scope.buildings[i].id;
                }
            }
        }

        $scope.setSelectedCityModal = function(city,userId){
            if(city === null)
            {
                $scope.loadUserReservationsByUserID(userId);
                $scope.buildingStatus = "false";
            }
            else{
                $scope.cityId="";
                for(var i=0; i<$scope.cities.length; i++){
                    if(city==$scope.cities[i].city_name){
                        $scope.cityId=$scope.cities[i].id;
                    }
                }
                UniversalService.GetAllBuildingsByCity($scope.cityId)
                    .then(function (a) {
                        $scope.buildings=a;
                    });
                $scope.buildingStatus = "true";
                $scope.loadUserReservationsByCityUserID(userId);
            }
        }

        $scope.setSelectedBuildingModal = function(building){

            if(building === null)
            {
                $scope.loadUserReservationsByCityUserID($scope.user.id);
            }
            else
            {
                $scope.buildingId="";
                for(var i=0; i<$scope.buildings.length; i++){
                    if(building==$scope.buildings[i].address){
                        $scope.buildingId=$scope.buildings[i].id;
                    }
                }
                UniversalService.GetUserReservationsByCityAndBuildingAndUserID($scope.cityId, $scope.buildingId, $scope.user.id)
                    .then(function (data) {
                        $scope.reservations = data;
                    });
            }
        }

        $scope.setSelectedEnum = function (equipment) {
            $scope.selectedEnum = "";
            for (var i = 0; i < $scope.enums.length; i++) {
                if (equipment == $scope.enums[i]) {
                    $scope.selectedEnum =$scope.enums[i];
                }
            }
        }

        $scope.getBuildingsByCity = function (city) {
            if (city) {
                $scope.setSelectedCity(city);
                UniversalService.GetAllBuildingsByCity($scope.cityId)
                    .then(function (data) {
                        if (data && data.length > 0) {
                            $scope.buildings = data;
                            //$scope.selectedBuilding = "";
                        } else {
                            $scope.buildings = [];
                        }
                    });
            } else {
                $scope.buildings = [];
                $scope.selectedCity = "";
                $scope.selectedBuilding = "";
                $scope.cityId = "";
                $scope.buildingId = "";
            }

        }

        $scope.preselect = function (cityName, buildingAddress) {
            $scope.selectedCity = cityName;
            $scope.selectedBuilding = buildingAddress;
        }


        /* Show the modal */
        $scope.toggleCity = function (modalstate, id) {

            $scope.modalstate = modalstate;
            switch (modalstate) {
                case 'add':
                    $scope.state = "Add New City";
                    $scope.city = {
                        city_name: "",
                    };
                    break;
                case 'edit':
                    $scope.state = "City Detail";
                    $scope.city_id = id;

                    UniversalService.GetCity(id)
                        .then(function (data) {
                            $scope.city = data;
                        });
                    break;
                default: break;
            }
            $scope.openCity();
        };

        $scope.toggleBuilding = function (modalstate, id) {

            $scope.modalstate = modalstate;
            switch (modalstate) {
                case 'add':
                    $scope.state = "Add New Building";
                    $scope.selectedCity = "";
                    $scope.building = {
                        address: "",
                    };
                    break;
                case 'edit':
                    $scope.state = "Building Detail";
                    $scope.building_id = id;

                    UniversalService.GetBuilding(id)
                        .then(function (data) {
                            $scope.building = data;
                            $scope.setSelectedCity($scope.building.city_name);
                            $scope.preselect($scope.building.city_name, "");
                        });
                    break;
                default: break;
            }
            $scope.openBuilding();
        };

        $scope.toggleRoom = function (modalstate, id) {
            $scope.modalstate = modalstate;
            switch (modalstate) {
                case 'add':
                    $scope.state = "Add New Room";
                    $scope.selectedCity = "";
                    $scope.selectedBuilding = "";
                    $scope.room = {
                        address: "",
                        city_id: "",
                    };
                    break;
                case 'edit':
                    $scope.state = "Room Detail";
                    UniversalService.GetRoom(id)
                        .then(function (data) {
                            $scope.room = data;
                            $scope.buildingId = $scope.room.building_id;
                            $scope.getBuildingsByCity($scope.room.city_name);
                            $scope.preselect($scope.room.city_name, $scope.room.address);
                        });
                    break;
                default: break;
            }
            $scope.openRoom();
        };

        $scope.toggleEquipment = function (modalstate, id) {
            $scope.modalstate = modalstate;
            switch (modalstate) {
                case 'add':
                    $scope.state = "Add New Equipment";
                    $scope.selectedCity = "";
                    $scope.selectedBuilding = "";
                    $scope.selectedEnum = "";
                    $scope.equipment = {
                        equipment_code: "",
                        equipment_type: "",
                        building_id: "",
                    };
                    break;
                case 'edit':
                    $scope.state = "Equipment Detail";
                    UniversalService.GetEquipment(id)
                        .then(function (data) {
                            $scope.equipment = data;
                            $scope.buildingId = $scope.equipment.building_id;
                            $scope.setSelectedEnum($scope.equipment.equipment_type);
                            $scope.getBuildingsByCity($scope.equipment.city_name);
                            $scope.preselect($scope.equipment.city_name, $scope.equipment.address);
                        });
                    break;
                default: break;
            }
            $scope.openEquipment();
        };

        $scope.toggleUser = function (modalstate, id) {
            $scope.modalstate = modalstate;
            switch (modalstate) {
                case 'add':
                    $scope.showField = true;
                    $scope.state = "Add New User";
                    $scope.user = {};
                    $scope.isAdminSelected = $scope.adminSelectList[0];
                    $scope.openUser();
                    break;
                case 'edit':
                    $scope.state = "User Detail";
                    $scope.showField = false;
                    UniversalService.GetUser(id)
                        .then(function (data) {
                            $scope.user = data;
                            $scope.isAdminSelected = $scope.adminSelectList[$scope.user.is_admin];
                        });
                    $scope.openUser();
                    break;
                case 'reservations':
                    $scope.state = "User Reservations";
                    $scope.showField = false;
                    $scope.loadUserReservationsByUserID(id);
                    $scope.openUserReservations();
                    break;
                default: break;
            }

        };

        $scope.toggleUserReservation = function(id, userId){
            EditService.open(id)
                .then(function () {
                    UniversalService.GetUserReservationsByUserID(userId)
                        .then (function (data) {
                            $scope.reservations = data;
                        });
                });
        };


        $scope.openCity = function (size) {debugger;
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'cityModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                scope: $scope,
                // resolve: {
                //     items: function () {
                //         return $scope.items;
                //     }
                // }
            });

            modalInstance.result.then(function () {
                $scope.loadCities();
            }, function () {
            });
        };

        $scope.openBuilding = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'buildingModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                scope: $scope,
            });

            modalInstance.result.then(function () {
                $scope.loadBuildings();
            }, function () {
            });
        };

        $scope.openRoom = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'roomModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                scope: $scope,
            });

            modalInstance.result.then(function () {
                $scope.loadRooms();
            }, function () {
            });
        };

        $scope.openEquipment = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'equipmentModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                scope: $scope,
            });

            modalInstance.result.then(function () {
                $scope.loadEquipment();
            }, function () {
            });
        };

        $scope.openUser = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'userModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                scope: $scope,
            });

            modalInstance.result.then(function () {
                $scope.loadUsers();
            }, function () {
            });
        };

        $scope.openUserReservations = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'userReservationsModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: "modal-dialog modal-lg",
                scope: $scope,
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        };


        //---Deletes

        $scope.confirmDelete = function(ev,id,state) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to remove this item?')
                .textContent('This action cannot be undone')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

        $mdDialog.show(confirm).then(function() {
            var obj = {id: id};
            switch(state){
                case "City":
                    UniversalService.DeleteCity(obj);
                    $scope.loadCities();
                    break;
                case "Building" :
                    UniversalService.DeleteBuilding(obj);
                    $scope.loadBuildings();
                    break;
                case "Room":
                     UniversalService.DeleteRoom(obj);
                     $scope.loadRooms();
                    break;
                case "Equipment":
                    UniversalService.DeleteEquipment(obj);
                    $scope.loadEquipment();
                    break;
                case "User":
                    UniversalService.DeleteUser(obj);
                    $scope.loadUsers();
                    break;
                default: break;
            }
        }, function() {
        $scope.status = 'You decided to keep this item';
        });
    };

        $scope.configurateDatetimePicker = function (state) {
            if (state == 'start') {
                return {
                    configureOn: null,
                    minView: 'day',
                    modelType: 'Date',
                    parseFormat: 'YYYY-MM-DD',
                    startView: 'year',
                    dropdownSelector: '#dropdownStart',
                    renderOn: 'end-date-changed'
                };
            }
            else {
                return {
                    configureOn: null,
                    minView: 'day',
                    modelType: 'Date',
                    parseFormat: 'YYYY-MM-DD',
                    startView: 'year',
                    dropdownSelector: '#dropdownEnd',
                    renderOn: 'start-date-changed'
                };
            }
        }

        $scope.confirmDeleteReservation = function(id, userId){
            var obj = {
                id: id
            };
            var isOkDelete = confirm('Is it ok to delete this?');
            if(isOkDelete){
                UniversalService.RemoveReservation(obj);
                UniversalService.GetUserReservationsByUserID(userId)
                    .then (function (data) {
                        $scope.reservations = data;
                    });
            } else {
                return false;
            }
        }

        $scope.setUserFilter = function (filter) {
            $scope.userFilter = filter;
            $scope.userFilterStatus = true;
            $scope.userFilterValue = "";
        }

        $scope.setUserFilterValue = function (userFilterValue) {
            if ($scope.userFilterValue === "") {
                $scope.loadUsers(function (data) {
                    if (data) {
                        repageUsers();
                    }
                });
                return;
            }
            switch ($scope.userFilter) {
                case "First name":
                    filterUsersByFirstName(userFilterValue); break;
                case "Last name":
                    filterUsersByLastName(userFilterValue); break;
                case "Position":
                    filterUsersByPosition(userFilterValue); break;
                case "City":
                    filterUsersByCity(userFilterValue);
            }
        }

        function filterUsersByFirstName(firstName) {
            UniversalService.FilterUsersByFirstName(firstName)
                .then(function (a) {
                    $scope.users = a;
                    repageUsers();
                });
        }

        function filterUsersByLastName(lastName) {
            UniversalService.FilterUsersByLastName(lastName)
                .then(function (a) {
                    $scope.users = a;
                    repageUsers();
                });
        }

        function filterUsersByPosition(position) {
            UniversalService.FilterUsersByPosition(position)
                .then(function (a) {
                    $scope.users = a;
                    repageUsers();
                });
        }

        function filterUsersByCity(city) {
            UniversalService.FilterUsersByCity(city)
                .then(function (a) {
                    $scope.users = a;
                    repageUsers();
                });
        }

        function repageUsers() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                end = begin + $scope.numPerPage;
            $scope.filteredUsers = $scope.users.slice(begin, end);
        }
    }
})();

angular.module('app').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, UniversalService, $filter) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.saveDataCity = function (modalstate) {

        var obj = {
            id: $scope.city.id,
            city_name: $scope.city.city_name
        };
        switch (modalstate) {
            case 'add':
                UniversalService.AddCity(obj);
                break;
            case 'edit':
                UniversalService.EditCity(obj);
                break;
            default: break;
        }
        $uibModalInstance.close();
    };

    $scope.saveDataBuilding = function (modalstate) {
        var obj = {
            id: $scope.building.id,
            city_id: $scope.cityId,
            address: $scope.building.address
        };
        switch (modalstate) {
            case 'add':
                UniversalService.AddBuilding(obj);
                break;
            case 'edit':
                UniversalService.EditBuilding(obj);
                break;
            default: break;
        }
        $uibModalInstance.close();
    };

    $scope.saveDataRoom = function (modalstate) {
        var obj = {
            id: $scope.room.id,
            room_nr: $scope.room.room_nr,
            capacity: $scope.room.capacity,
            building_id: $scope.buildingId,
        };
        switch (modalstate) {
            case 'add':
                UniversalService.AddRoom(obj);
                break;
            case 'edit':
                UniversalService.EditRoom(obj);
                break;
            default: break;
        }
        $uibModalInstance.close();
    };

    $scope.saveDataEquipment = function (modalstate) {
        var equipment_type = parseInt($scope.selectedEnum, 10) + 1;
        var obj = {
            id: $scope.equipment.id,
            equipment_type: $scope.selectedEnum,
            equipment_code: $scope.equipment.equipment_code,
            building_id: $scope.buildingId,
        };
        switch (modalstate) {
            case 'add':
                UniversalService.AddEquipment(obj);
                break;
            case 'edit':
                UniversalService.EditEquipment(obj);
                break;
            default: break;
        }
        $uibModalInstance.close();
    };

    $scope.saveDataUser = function (modalstate) {
        $scope.user.birth_date = $filter('date')($scope.user.birth_date, "yyyy-MM-dd");
        $scope.user.employment_date = $filter('date')($scope.user.employment_date, "yyyy-MM-dd");
        switch (modalstate) {
            case 'add':
                var obj = {
                    id: $scope.user.id,
                    first_name: $scope.user.first_name,
                    last_name: $scope.user.last_name,
                    username: $scope.user.username,
                    password: $scope.user.password,
                    email: $scope.user.email,
                    position: $scope.user.position,
                    city: $scope.user.city,
                    address: $scope.user.address,
                    employment_date: $scope.user.employment_date,
                    birth_date: $scope.user.birth_date,
                    is_admin: $scope.isAdminSelected['key'],
                };
                UniversalService.AddUser(obj);
                break;
            case 'edit':
                var obj = {
                    id: $scope.user.id,
                    first_name: $scope.user.first_name,
                    last_name: $scope.user.last_name,
                    username: $scope.user.username,
                    email: $scope.user.email,
                    position: $scope.user.position,
                    city: $scope.user.city,
                    address: $scope.user.address,
                    employment_date: $scope.user.employment_date,
                    birth_date: $scope.user.birth_date,
                    is_admin: $scope.isAdminSelected['key'],
                };
                UniversalService.EditUser(obj);
                break;
            default: break;
        }
        $uibModalInstance.close();
    };


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
