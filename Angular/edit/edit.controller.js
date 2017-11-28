angular.module('app').controller('EditController', function ($scope, $rootScope, $uibModalInstance, UniversalService, EditService, $filter, $location) {
    $scope.availableRooms = [];
    $scope.availableEquipment = [];
    $scope.inputRequired = true;

    loadValues();

    function loadValues() {
        EditService.GetInformationByReservation($rootScope.reservation_id).then(function (val) {
            $scope.selectedValues = {
                city_id: val[0].city_id,
                start_date: val[0].start_date,
                end_date: val[0].end_date,
                building_id: val[0].building_id,
                room_id: val[0].room_id,
                address: val[0].address,
                room_nr: val[0].room_nr,
                capacity: val[0].capacity,
                reservation_equip: [],
                equip_selection_strings: []
            };

            UniversalService.GetEquipmentByReservation($rootScope.reservation_id).then(function (val) {
                $scope.selectedValues.reservation_equip = val;
                $scope.items = [];
                $scope.isDisabled = [];
                for (var i = 0; i < $scope.selectedValues.reservation_equip.length; i++) {
                    var equip_selection_string = $scope.selectedValues.reservation_equip[i].equipment_type + " (" + $scope.selectedValues.reservation_equip[i].equipment_code + ")";
                    $scope.selectedValues.equip_selection_strings.push(equip_selection_string);
                    $scope.items[i] = i;
                }
                recountDisabledStatus();
            });

            UniversalService.GetRoomsByBuildingAndReservation($scope.selectedValues.building_id, $rootScope.reservation_id, $scope.selectedValues.start_date, $scope.selectedValues.end_date).then(function (val) {
                $scope.availableRooms = val;
                $scope.roomStatus = "true";
                for (var i = 0; i < $scope.availableRooms.length; i++) {
                    if ($scope.availableRooms[i].room_id === $scope.selectedValues.room_id) {
                        $scope.selectedIndex = i;
                        break;
                    }
                }
                $scope.selected = $scope.availableRooms[$scope.selectedIndex];
            });

            UniversalService.GetEquipmentByBuildingAndReservation($scope.selectedValues.building_id, $rootScope.reservation_id, $scope.selectedValues.start_date, $scope.selectedValues.end_date).then(function (val) {
                $scope.availableEquipment = val;
                if ($scope.availableEquipment.length > 0) {
                    $scope.equipmentStatus = "true";
                    $scope.maxEquipmentCount = $scope.availableEquipment.length;
                }
                if ($scope.items.length < $scope.maxEquipmentCount) {
                    $scope.addStatus = "true";
                }
                removeEquipment();
            });

            $scope.isDateValid = true;
            $scope.isRoomSelected = true;
        });
    }

    $scope.$watchGroup(['isDateValid', 'isRoomSelected'], function (newValue, oldValue, scope) {
        if (newValue != oldValue) {
            if ($scope.isDateValid == true && $scope.isRoomSelected == true) {
                $scope.isEditDisabled = false;
            } else {
                $scope.isEditDisabled = true;
            }
        }
    });

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.openStartCalendar = function (e, picker) {
        $scope.selectedValues.start_date.open = true;
    };

    $scope.openEndCalendar = function (e, picker) {
        $scope.selectedValues.end_date.open = true;
    };

    $scope.startDateOnSetTime = function () {
        $scope.$broadcast('start-date-changed');
    };

    $scope.endDateOnSetTime = function () {
        $scope.$broadcast('end-date-changed');
    };

    function filterDate(inputDate) {
        return $filter('date')(inputDate, "yyyy-MM-dd HH:mm:ss");
    }

    function isDateSuccess() {
        var start_date = filterDate($scope.selectedValues.start_date);
        var end_date = filterDate($scope.selectedValues.end_date);
        if (start_date !== undefined && end_date !== undefined) {
            if (isDateValid(start_date, end_date) == 'true') {
                $scope.isDateValid = true;
            }
            else $scope.isDateValid = false;
        }
    }

    function isDateValid(start, end) {
        if (start < end) {
            currentTime = today();
            if (start < currentTime) return "pastDate";
            else return "true";
        }
        else return "pastDate";
    }

    function today() {
        currentTime = new Date();
        currentTime = filterDate(currentTime);
        return currentTime;
    }

    $scope.$watchGroup(['selectedValues.start_date', 'selectedValues.end_date'], function (newValue, oldValue, scope) {
        if (oldValue != newValue) {
            var start_date = filterDate($scope.selectedValues.start_date);
            var end_date = filterDate($scope.selectedValues.end_date);
            var currentTime = today();

            isDateSuccess();

            switch (isDateValid(start_date, end_date)) {
                case 'true':
                    $scope.Time(start_date, end_date); break;
                default: break;
            }
        }
    });

    $scope.startDateBeforeRender = function ($dates, start, end) {
        if (start !== undefined && end !== undefined) {
            start = filterDate(start);
            end = filterDate(end);
            var currentTime = $filter('date')(Date.now(), "yyyy-MM-dd HH:mm:ss");
            switch (isDateValid(start, end)) {
                case "true":
                    for (var i = 0; i < $dates.length; i++) {
                        var d = $filter('date')($dates[i].utcDateValue, "yyyy-MM-dd HH:mm:ss");
                        if (d < start) {
                            $dates[i].selectable = false;
                        }
                        else if (d > start) {
                            if (d > end) $dates[i].selectable = false;
                            else $dates[i].selectable = true;
                        }
                    }
                    break;
                case "pastDate":
                    for (var i = 0; i < $dates.length; i++) {
                        var d = $filter('date')($dates[i].utcDateValue, "yyyy-MM-dd HH:mm:ss");
                        if (d < currentTime) {
                            $dates[i].selectable = false;
                        }
                        else {
                            $dates[i].selectable = true;
                        }
                    }
                    break;
                default: break;
            }
        }
    };
    $scope.endDateBeforeRender = function ($view, $dates, start) {
        if (start !== undefined) {
            var sh = $filter('date')($dates[0].utcDateValue, "yyyy-MM-dd HH:mm:ss");
            if ($scope.selectedValues.start_date !== undefined) {
                var activeDate = moment($scope.selectedValues.start_date).subtract(1, $view).add(1, 'minute');
                $dates.filter(function (date) { return date.localDateValue() <= activeDate.valueOf() }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }
    };

    $scope.Time = function (startDate, endDate) {
        $scope.selectedValues.start_date = $filter('date')(startDate, "yyyy-MM-dd HH:mm:ss");
        $scope.selectedValues.end_date = $filter('date')(endDate, "yyyy-MM-dd HH:mm:ss");
        UniversalService.GetRoomsByBuildingAndReservation($scope.selectedValues.building_id, $rootScope.reservation_id, $scope.selectedValues.start_date, $scope.selectedValues.end_date).then(function (a) {
            $scope.availableRooms = a;
            var isStillAvailable = false;
            for (var i = 0; i < $scope.availableRooms.length; i++) {
                if ($scope.availableRooms[i].room_id === $scope.selectedValues.room_id) {
                    isStillAvailable = true;
                    $scope.selectedIndex = i;
                    $scope.selected = $scope.availableRooms[i];
                    $scope.isRoomSelected = true;
                    break;
                }
            }
            if (!isStillAvailable) {
                $scope.selectedValues.room_id = "";
                $scope.selectedValues.room_nr = "";
                $scope.selectedValues.capacity = "";
                $scope.isRoomSelected = false;
            }
            if ($scope.availableRooms.length === 0) {
                $scope.roomStatus = "false";
                $scope.errorStatus = "true";
            } else {
                $scope.roomStatus = "true";
                $scope.errorStatus = "false";
            }
        });
        $scope.selectedValues.reservation_equip = [];
        $scope.selectedValues.equip_selection_strings = [];
        $scope.items = [];
        $scope.isDisabled = [];
        UniversalService.GetEquipmentByBuildingAndReservation($scope.selectedValues.building_id, $rootScope.reservation_id, $scope.selectedValues.start_date, $scope.selectedValues.end_date).then(function (eq) {
            $scope.availableEquipment = eq;
            if ($scope.availableEquipment.length > 0) {
                $scope.equipmentStatus = "true";
                $scope.addStatus = "true";
                $scope.maxEquipmentCount = $scope.availableEquipment.length;
            } else {
                $scope.equipmentStatus = "false";
                $scope.addStatus = "false";
            }
        });
    };

    $scope.SelectedRoom = function (room) {
        if (room !== null) {
            $scope.selectedValues.room_id = room.room_id;
            $scope.selectedValues.room_nr = room.room_nr;
            $scope.selectedValues.capacity = room.capacity;
            $scope.selectedValues.room_selection_string = "Address: " + room.address + ", Room: " + room.room_nr + ", Capacity: " + room.capacity;
            $scope.isRoomSelected = true;
        }
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
        removeDuplicates()
    };

    $scope.add = function () {
        if ($scope.items.length < $scope.maxEquipmentCount) {
            $scope.items.push($scope.items.length);
            $scope.addStatus = "false";
            removeEquipment();
            removeDuplicates()
        }
        recountDisabledStatus();
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
        removeEquipment();
        removeDuplicates()
        recountDisabledStatus();
    };

    function removeEquipment() {
        for (var i = 0; i < $scope.selectedValues.reservation_equip.length; i++) {
            for (var j = 0; j < $scope.availableEquipment.length; j++) {
                if ($scope.availableEquipment[j].equipment_type == $scope.selectedValues.reservation_equip[i].equipment_type &&
                    $scope.availableEquipment[j].equipment_code == $scope.selectedValues.reservation_equip[i].equipment_code) {
                    $scope.availableEquipment.splice(j, 1);
                }
            }
        }
    }

    function addEquipment(item) {
        $scope.availableEquipment.push(item);
    }

    function removeDuplicates() {
        $scope.availableEquipment = $scope.availableEquipment.filter(function (elem, index, self) {
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

    $scope.EditReservation = function () {
        var obj = {
            reservation_id: $rootScope.reservation_id,
            room_id: $scope.selectedValues.room_id,
            start_date: $scope.selectedValues.start_date,
            end_date: $scope.selectedValues.end_date,
            reservation_equip: $scope.selectedValues.reservation_equip
        };
        UniversalService.EditReservation(obj);
        $uibModalInstance.close();
    };

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
});
