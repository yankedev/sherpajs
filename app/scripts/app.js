'use strict';

angular.module('sherpajsApp', ['ngResource'])
  .config(function ($routeProvider) {
    $routeProvider
                .when('/orders/:username/:year/:week/', {
                    templateUrl: 'views/order.html',
                    controller: 'OrderCtrl'
                })
                .when('/', {templateUrl: 'views/main.html', controller: 'MainCtrl'})
                .when('/pickup', {templateUrl: 'views/pickup.html', controller: 'OrderCtrl'})
                .when('/groupadmin', {templateUrl: 'views/groupadmin.html', controller: 'OrderCtrl'})
                .when('/orderadmin', {templateUrl: 'views/orderadmin.html', controller: 'OrderCtrl'})
                .otherwise({redirectTo: '/orders/yanke/2013/32/'});

    }).
    config(function($httpProvider) {
        function loadingInterceptor($q,$log, $rootScope) {
            function success(response) {
                $rootScope.loading=false;
                return response;
            }
            function error(response) {
                var status = response.status;
                $log.error('Response status: ' + status + '. ' + response);
                $rootScope.loading=false;
                return $q.reject(response);
            }
            return function(promise) {
                $rootScope.loading=true;
                return promise.then(success, error);
            }
        }
        $httpProvider.responseInterceptors.push(loadingInterceptor);
    })
    .factory('SherpaService', ['Categories', function(Categories, $http){
        return {
            getOrderWeek: function($http){
                var orderWeek = "0-0000";
                $http.get('/app/md/order/week').success(function(data){
                    return data;
                });
            },
            getCatalogX: function(Categories) {
                return  Categories.query();
            },
            getCatalog: function() {
                return  [{name:'pippo'},{name:'pluto'}];
            }
        };
    }])
    .filter('formatPrice', function() {
        return function(input) {
            if (input == null) return "";
            return (input/100*100).toFixed(2);
        };
    });
