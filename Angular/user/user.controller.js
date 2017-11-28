    'use strict';
   var app= angular.module('app').controller('UserController', UserController);

    function UserController($location, FlashService, UniversalService, $scope, $sce, $rootScope, $log, $mdDialog, $cookies, EditService) {
        $scope.cities=[];
        $scope.cityBuildings=[];

        $scope.userInformation=[];
        $scope.userReservations=[];
        loadUserInformation();
        loadCities();
        loadUserReservations();
        init();


    function init(){
         //$cookies.get('User');
       }

       $scope.currentPage = 1,
       $scope.numPerPage = 10,
       $scope.maxSize = 5;


       $scope.$watchCollection('userReservations', function(newValue,oldValue) {
         if(oldValue!=newValue){
             $scope.filteredReservations =newValue;
             $scope.userReservations=$scope.filteredReservations;
         }
         var begin = (($scope.currentPage - 1) * $scope.numPerPage),
             end = begin + $scope.numPerPage;
         $scope.filteredReservations = $scope.userReservations.slice(begin, end);

       },true);

       $scope.$watch('currentPage + numPerPage', function () {
           loadUserReservations(function (a) {
           var begin = (($scope.currentPage - 1) * $scope.numPerPage),
               end = begin + $scope.numPerPage;
           $scope.filteredReservations= $scope.userReservations.slice(begin, end);
        })
       });


    $scope.setSelectedCity = function(city){
        if(city === null)
        {
            loadUserReservations();
            $scope.buildingStatus = "false";
        }
        else{
        $scope.cityId="";
            for(var i=0; i<$scope.cities.length; i++){
                if(city==$scope.cities[i].city_name){
                    $scope.cityId=$scope.cities[i].id;
                }
        }
        loadBuildings();
        $scope.buildingStatus = "true";
        loadUserReservationsByCity($scope.cityId);
        }
    }

    $scope.setSelectedBuilding = function(building){

        if(building === null)
        {
            loadUserReservationsByCity($scope.cityId)
        }
        else
        {
        $scope.buildingId="";
            for(var i=0; i<$scope.cityBuildings.length; i++){
                if(building==$scope.cityBuildings[i].address){
                    $scope.buildingId=$scope.cityBuildings[i].id;
                }
        }
        loadUserReservationsByCityAndAddress($scope.cityId, $scope.buildingId);
        }
    }

    function loadCities() {
            UniversalService.GetUserCities()
                .then(function (a) {
                    $scope.cities=a;
                });
    }

    function loadBuildings() {
            UniversalService.GetUserBuildingsByCity($scope.cityId)
                .then(function (a) {
                    $scope.cityBuildings=a;
                });
    }

    function loadUserInformation(){
        UniversalService.GetUserInformation()
            .then(function (a) {
                    $scope.userInformation = a;
            });
    }

    function loadUserReservations(callback){
        UniversalService.GetUserReservations()
            .then(function (a) {
                    $scope.userReservations = a;
                    if (callback) {
                        callback(a);
                    }
            });
    }

    function loadUserReservationsByCity(){
        UniversalService.GetUserReservationsByCity($scope.cityId)
            .then(function (a) {
                    $scope.userReservations = a;
            });
    }

    function loadUserReservationsByCityAndAddress(){
        UniversalService.GetUserReservationsByCityAndBuilding($scope.cityId, $scope.buildingId)
            .then(function (a) {
                    $scope.userReservations = a;
            });
    }

    $scope.showConfirm = function(ev,index) {
                console.log(index);
            var confirm = $mdDialog.confirm()
          .title('Would you like to delete your reservation?')
          .textContent('Your reservation will be deleted.')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');

        $mdDialog.show(confirm).then(function() {
            $scope.removeReservation(index);
        }, function() {
        $scope.status = 'You decided to keep your reservation.';
        });
    };

    $scope.removeReservation = function(id){
           var obj = {
            id: id
          };
        UniversalService.RemoveReservation(obj);
        loadUserReservations();
    }

    $scope.toggle = function(id){
        EditService.open(id)
            .then(function () {
                loadUserReservations();
        });


    };
}
