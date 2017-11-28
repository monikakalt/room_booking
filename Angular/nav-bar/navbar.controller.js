angular
  .module('app')
  .controller('navbarController', function (UniversalService, $scope, $timeout, $mdSidenav, $location, $rootScope) {

    $scope.toggleLeft = buildToggler('left');
    loadUserInformation();

    $scope.isActive = function () {
      var wrongUrls = ["/login", "/register", "/forgot", "/pageNotFound"];
      var path = $location.path();
      for (var i = 0; i < wrongUrls.length; i++) {
        var excludeUrl = wrongUrls[i];
        //if the path starts with the given url, hide the navbar
        if (path.indexOf(excludeUrl) === 0) {
          return false;
        }
      }
      return true;
    };

    function buildToggler(componentId) {
      return function () {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.logout = function () {
      UniversalService.ClearCredentials();
      window.location.href = '#!/login';
    };

    function loadUserInformation() {
      UniversalService.GetUserInformation()
        .then(function (a) {
          $scope.userInformation = a;
          checkIfAdmin();
        });
    }

    function checkIfAdmin(){
      if($scope.userInformation[0].is_admin){
        $scope.isAdmin = "true";
      } else {
        $scope.isAdmin = "false";
      }
    }

  });
