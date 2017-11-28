(function () {
    'use strict';

    var app = angular.module('app', ['ngRoute', 'ngCookies', 'ui.calendar', 'ui.bootstrap', 'ngMaterial', 'ui.bootstrap.datetimepicker', 'ui.dateTimeInput', 'ngAnimate'])
        .constant('urls', {
            BASE: 'http://localhost:8000' //,
            // BASE_API: 'http://api.jwt.dev:8000/v1'
        })
        .config(config).run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider

            .when('/main', {
                needLogin: true,
                controller: 'MainController',
                templateUrl: 'main/main.view.html',
            })


            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
            })

            .when('/admin', {

                controller: 'AdminController',
                templateUrl: 'admin/admin.view.html',
                needAdmin: true,
            })

            .when('/admin/cities', {
                needAdmin: true,
                controller: 'AdminController',
                templateUrl: 'admin/admin_cities.view.html',
            })

            .when('/admin/buildings', {
                needAdmin: true,
                controller: 'AdminController',
                templateUrl: 'admin/admin_buildings.view.html',
            })

            .when('/admin/rooms', {
                needAdmin: true,
                controller: 'AdminController',
                templateUrl: 'admin/admin_rooms.view.html',
            })

            .when('/admin/equipment', {
                needAdmin: true,
                controller: 'AdminController',
                templateUrl: 'admin/admin_equipment.view.html',
            })

            .when('/admin/users', {
                needAdmin: true,
                controller: 'AdminController',
                templateUrl: 'admin/admin_users.view.html',
            })

            .when('/forgot', {
                controller: 'LoginController',
                templateUrl: 'forgot/forgot.view.html',
            })
            .when('/forgot/:id', {
                controller: 'LoginController',
                templateUrl: 'forgot/change.view.html',
            })
            .when('/reservation', {
                needLogin: true,
                controller: 'ReservationController',
                templateUrl: 'reservation/reservation.view.html',
            })

            .when('/user', {
                needLogin: true,
                controller: 'UserController',
                templateUrl: 'user/user.view.html',
            })

            .otherwise({
                controller: 'PageNotFoundController',
                templateUrl: 'notfound/notfound.view.html',
            })
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http', 'UniversalService'];
    function run($rootScope, $location, $cookies, $http, UniversalService) {
        // var authData=[];
        // var restrictedPage = $.inArray($location.path(), ['/login' , '/register','/forgot','/forgot']) === -1;
        // // keep user logged in after page refresh

        $rootScope.User = $cookies.get('User') || {};
        if ($rootScope.User) {
            $http.defaults.headers.common['Authorization'] = $rootScope.User;
            //checkAuth();
        }

        $rootScope.$on('$routeChangeStart', function (event, current) {
            $rootScope.pageTitle = current.$$route.title;
            if (current.$$route.needLogin || current.$$route.needAdmin) {
                checkAuth(current)
            }
        });
        function checkAuth(current) {
            UniversalService.AuthenticateUser()
                .then(function (data) {
                    if (data['authorized'] != true) {
                        window.location.href = '#!/login';
                    }
                    else if (current.$$route.needAdmin && data['authorized'] === true && data["is_admin"] != true) {
                        window.location.href = '#!/main';
                    }

                }, function (error) {
                    $location.path('/login');
                });
        }
    }

})();
