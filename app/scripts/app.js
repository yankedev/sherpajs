'use strict';

var sherpa = angular.module('sherpajsApp', ['ngResource', 'ngRoute', 'ui.bootstrap', 'SherpaService', 'mongolab', 'OrderService2']);

sherpa.config(function ($routeProvider) {
    $routeProvider
                .when('/orders/:groupId/:year/:week/:username/', {
                    templateUrl: 'views/order.html',
                    controller: 'OrderCtrl as orderCtrl'
                })
                .when('/group/:groupId/:year/:week/', {
                    templateUrl: 'views/group.html',
                    controller: 'GroupCtrl'
                })
                .when('/yeoman', {templateUrl: 'views/main.html', controller: 'MainCtrl'})
                .when('/pickup', {templateUrl: 'views/pickup.html', controller: 'OrderCtrl'})
                .when('/groupadmin', {templateUrl: 'views/groupadmin.html', controller: 'OrderCtrl'})
                .when('/orderadmin', {templateUrl: 'views/orderadmin.html', controller: 'OrderCtrl'})
                .otherwise({redirectTo: '/orders/group1/2013/32/yanke/'});

    })
    .config(function($httpProvider) {
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
    .filter('formatPrice', function() {
        return function(input) {
            if (input == null) return "";
            return (input/100*100).toFixed(2)+ ' CHF';
        };
    });

function getCategory(categories, name){
    for(var i=0;i<categories.length;i++){
        var cat = categories[i];
        if (cat.name == name){
            return cat;
        }
    }
    return undefined;
};