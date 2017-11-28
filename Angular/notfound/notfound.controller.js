'use strict';
var app = angular.module('app').controller('PageNotFoundController', PageNotFoundController);

function PageNotFoundController($location, UniversalService, $scope, $sce, $rootScope, $log, $mdDialog, $cookies, $filter) {
  $location.path('/pageNotFound');
}
