'use strict';
var app = angular.module('app').controller('ReservationController', ReservationController);

function ReservationController($location, UniversalService, $scope, $sce, $rootScope, $log, $mdDialog, $cookies, $filter) {
  $scope.cities = [];
  $scope.rooms = [];
  $scope.allEquipment = [];

  $scope.selectedValues = {
    city_id: "",
    city_name: "",
    start_date: "",
    end_date: "",
    building_id: "",
    room_id: "",
    address: "",
    room_nr: "",
    capacity: "",
    room_selection_string: "",
    reservation_equip: [],
    equip_selection_strings: []
  };

  loadCities();
  init();

  $scope.openStartCalendar = function (e, picker) {
    $scope.selectedValues.start_date.open = true;
  };
  $scope.openEndCalendar = function (e, picker) {
    $scope.selectedValues.end_date.open = true;
  };

  function init() {
    $cookies.get('User');
  }

  function loadCities() {
    UniversalService.GetCities()
      .then(function (a) {
        $scope.cities = a;
      });
  }

  $scope.setSelectedCity = function (city) {
    $scope.errorStatus = "false";
      $scope.selectedValues = {
          start_date: "",
          end_date: "",
          building_id: "",
          room_id: "",
          address: "",
          room_nr: "",
          capacity: "",
          room_selection_string: "",
          reservation_equip: [],
          equip_selection_strings: []
      };
    $scope.selectedValues.city_name = city;
    for (var i = 0; i < $scope.cities.length; i++) {
      if (city == $scope.cities[i].city_name) {
        $scope.selectedValues.city_id = $scope.cities[i].id;
      }
    }
  }

$scope.$watchGroup(['selectedValues.start_date', 'selectedValues.end_date'], function(newValue, oldValue, scope) {
  if(oldValue!=newValue){
    var start_date = $filter('date')($scope.selectedValues.start_date, "yyyy-MM-dd HH:mm:ss");
    var end_date = $filter('date')($scope.selectedValues.end_date, "yyyy-MM-dd HH:mm:ss");
    var currentTime=$filter('date')(Date.now(),"yyyy-MM-dd HH:mm:ss");
    if(start_date <= end_date && start_date >= currentTime){
        $scope.disabledStatus=false;
        $scope.Time(start_date,end_date);
        $scope.disabledMessage="";
    } else if(start_date > end_date && end_date){
        $scope.disabledMessage="Start date is bigger than end date!";
        $scope.disabledStatus=true;
    } else if(start_date < currentTime && end_date){
        $scope.disabledMessage="Start date is invalid";
        $scope.disabledStatus=true;
    }
    else{
        $scope.disabledStatus=true;
    }
  }
});

  $scope.SelectedRoom = function (room) {
    $scope.selectedValues.room_id = room.room_id;
    $scope.selectedValues.building_id = room.building_id;
    $scope.selectedValues.address = room.address;
    $scope.selectedValues.room_nr = room.room_nr;
    $scope.selectedValues.capacity = room.capacity;
    $scope.selectedValues.room_selection_string = "Address: " + room.address + ", Room: " + room.room_nr + ", Capacity: " + room.capacity;
    $scope.selectedValues.reservation_equip = [];
    $scope.selectedValues.equip_selection_strings = [];
    $scope.allowSubmit = "true";
    UniversalService.GetEquipmentByBuilding($scope.selectedValues.building_id, $scope.selectedValues.start_date, $scope.selectedValues.end_date).then(function (eq) {
      $scope.allEquipment = eq;
      $scope.maxEquipmentCount = $scope.allEquipment.length;
      if ($scope.maxEquipmentCount > 0) {
        $scope.addStatus = "true";
        $scope.equipmentStatus = "true";
      }
    });
  };
  $scope.startDateOnSetTime = function () {
    $scope.$broadcast('start-date-changed');
  };

  $scope.endDateOnSetTime = function () {
    $scope.$broadcast('end-date-changed');
  };

  $scope.startDateBeforeRender = function ($dates) {
    var currentTime=$filter('date')(Date.now(),"yyyy-MM-dd");
    for (var i =0; i < $dates.length; i++) {
      var d=$filter('date')($dates[i].utcDateValue, "yyyy-MM-dd");
      if(d >= currentTime){
         $dates[i].selectable = true;
      }
      else{
        $dates[i].selectable = false;
      }
    }
  };

  $scope.endDateBeforeRender = function ($view, $dates) {
    if ($scope.selectedValues.start_date) {
    var activeStart = moment($scope.selectedValues.start_date).subtract(1, $view).add(1, 'minute');
    var activateAfterEnd = moment($scope.selectedValues.end_date).subtract(1, $view).add(1, 'minute');
      for (var i =0; i < $dates.length; i++) {
        if($dates[i].localDateValue() <= activeStart.valueOf()){
            $dates[i].selectable = false;
        }
      }
    }
  };

  $scope.Time = function (startDate, endDate) {
    $scope.errorStatus = "false";
    $scope.allowSubmit = "false";
    $scope.selectedValues.start_date = $filter('date')(startDate, "yyyy-MM-dd HH:mm:ss");
    $scope.selectedValues.end_date = $filter('date')(endDate, "yyyy-MM-dd HH:mm:ss");
    $scope.items = [];
    $scope.isDisabled = [];
    $scope.selectedValues.building_id = "";
    $scope.selectedValues.room_id = "";
    $scope.selectedValues.address = "";
    $scope.selectedValues.room_nr = "";
    $scope.selectedValues.capacity = "";
    $scope.selectedValues.room_selection_string = "";
    $scope.selectedValues.reservation_equip = [];
    $scope.selectedValues.equip_selection_strings = [];
    UniversalService.GetRoomsByCity($scope.selectedValues.city_id, $scope.selectedValues.start_date, $scope.selectedValues.end_date).then(function (a) {
      $scope.rooms = a;
      if ($scope.rooms.length > 0) {
        $scope.roomStatus = "true";
      } else {
        $scope.errorStatus = "true";
      }
    });
  };

  $scope.AddEquipment = function (item, index) {
    if (item) {
      $scope.selectedValues.reservation_equip.splice(index, 1, item);
      var item_string = item.equipment_type + " (" + item.equipment_code + ")";
      $scope.selectedValues.equip_selection_strings.splice(index, 1, item_string);
    }
    if ($scope.items.length < $scope.maxEquipmentCount) {
      $scope.addStatus = "true";
    }
    removeDuplicates();
  };

  $scope.add = function () {
    if ($scope.items.length < $scope.maxEquipmentCount) {
      $scope.items.push($scope.items.length);
      $scope.addStatus = "false";
      recountDisabledStatus();
      removeEquipment();
      removeDuplicates();
    }
  };

  $scope.del = function (i) {
    if ($scope.selectedValues.reservation_equip[i] != null) {
      addEquipment($scope.selectedValues.reservation_equip[i]);
    }
    $scope.selectedValues.reservation_equip.splice(i, 1);
    $scope.selectedValues.equip_selection_strings.splice(i, 1);
    $scope.items.splice(i, 1);
    $scope.addStatus = "true";
    for (var i = 0; i < $scope.items.length; i++) {
      $scope.items[i] = i;
    }
    recountDisabledStatus();
    removeEquipment();
    removeDuplicates();
  };

  function removeEquipment() {
    for (var i = 0; i < $scope.selectedValues.reservation_equip.length; i++) {
      for (var j = 0; j < $scope.allEquipment.length; j++) {
        if ($scope.allEquipment[j].equipment_type == $scope.selectedValues.reservation_equip[i].equipment_type &&
          $scope.allEquipment[j].equipment_code == $scope.selectedValues.reservation_equip[i].equipment_code) {
          $scope.allEquipment.splice(j, 1);
        }
      }
    }
  }

  function addEquipment(item) {
    $scope.allEquipment.push(item);
  }

  function removeDuplicates() {
    $scope.allEquipment = $scope.allEquipment.filter(function (elem, index, self) {
      return index == self.indexOf(elem);
    });
  }

  function recountDisabledStatus() {
    for (var i = $scope.items.length - 1; i >= 0; i--) {
      if (i == $scope.items.length - 1) {
        $scope.isDisabled[i] = false;
      } else {
        $scope.isDisabled[i] = true;
      }
    }
  }

  $scope.Reserve = function () {
    var obj = {
      room_id: $scope.selectedValues.room_id,
      start_date: $scope.selectedValues.start_date,
      end_date: $scope.selectedValues.end_date,
      reservation_equip: $scope.selectedValues.reservation_equip
    };
    UniversalService.PostReservation(obj);
    $location.path('/main');
  };

  $scope.steps = [
    'City',
    'Date',
    'Room & Equipment'
  ];
  $scope.selection = $scope.steps[0];

  $scope.getCurrentStepIndex = function () {
    return _.indexOf($scope.steps, $scope.selection);
  };

  $scope.goToStep = function (index) {
    if (!_.isUndefined($scope.steps[index])) {
      if (isAllowedToGoToStep(index)) {
        $scope.selection = $scope.steps[index];
      }
    }
  };

  $scope.hasNextStep = function () {
    var stepIndex = $scope.getCurrentStepIndex();
    var nextStep = stepIndex + 1;
    return !_.isUndefined($scope.steps[nextStep]);
  };

  $scope.hasPreviousStep = function () {
    var stepIndex = $scope.getCurrentStepIndex();
    var previousStep = stepIndex - 1;
    return !_.isUndefined($scope.steps[previousStep]);
  };

  $scope.incrementStep = function () {
    if ($scope.hasNextStep()) {
      var stepIndex = $scope.getCurrentStepIndex();
      var nextStep = stepIndex + 1;
      if (isAllowedToGoToStep(nextStep)) {
        $scope.selection = $scope.steps[nextStep];
      }
    }
  };

  $scope.decrementStep = function () {
    if ($scope.hasPreviousStep()) {
      var stepIndex = $scope.getCurrentStepIndex();
      var previousStep = stepIndex - 1;
      $scope.selection = $scope.steps[previousStep];
    }
  };

  function isAllowedToGoToStep(stepIndex) {
    switch (stepIndex) {
      case 0:
        return true;
      case 1:
        if ($scope.selectedValues.city_name != "") {
          return true;
        } else {
          return false;
        }
      case 2:
        if (($scope.errorStatus == "true" || $scope.roomStatus == "true") && $scope.disabledStatus== false) {
          return true;
        } else {
          return false;
        }
    }
  }

  $scope.configurateDatetimePicker = function (state) {
    if (state == 'start') {
      return {
        configureOn: null,
        minuteStep: 30,
        minView: 'minute',
        modelType: 'Date',
        parseFormat: 'YYYY-MM-DDTHH:mm:ss.SSSZZ',
        startView: 'day',
        dropdownSelector: '#dropdownStart',
        renderOn: 'end-date-changed'
      }
    }

    else {
      return {
        configureOn: null,
        minuteStep: 30,
        minView: 'minute',
        modelType: 'Date',
        parseFormat: 'YYYY-MM-DDTHH:mm:ss.SSSZZ',
        startView: 'day',
        dropdownSelector: '#dropdownEnd',
        renderOn: 'start-date-changed'
      }
    }
  };

}
