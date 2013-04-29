'use strict';

angular.module('sherpajsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

angular.module('sherpajsApp')
    .controller('OrderCtrl', function ($scope, $routeParams, $http) {

        $scope.visibleCategory = 0;

        $scope.showCategory = function(i){
            if (i==$scope.visibleCategory) return true;
            return false;
        };

        $scope.setVisibleCategory = function(i){
            if (i==$scope.visibleCategory){
                $scope.visibleCategory = -1;
            }else{
                $scope.visibleCategory = i;
            }
        }

        $scope.toggleEditMode = function(item){
            var itemEditMode = !$scope.order.items[item.name].editMode;
            $scope.order.items[item.name].editMode = itemEditMode;
        };

        $scope.calculateTotals = function(category){
            var catTotal = 0;
            angular.forEach(category.items, function(item){
                var qty = $scope.order.items[item.name].qty;
                var price = item.price;
                var totalItem = qty*price;
                $scope.order.items[item.name].price = totalItem;
                catTotal = catTotal + totalItem;
            });
            $scope.weeklist.totals[category.name] = catTotal;
            $scope.calculateOrderTotal();
            return catTotal;
        };

        $scope.calculateOrderTotal = function(){
            var orderTotal = 0;
            angular.forEach($scope.weeklist.categories, function(category){
                var catTotal = $scope.weeklist.totals[category.name]
                if (catTotal != null)
                    orderTotal = orderTotal + catTotal;
            });
            $scope.order.total = orderTotal;
            return orderTotal;
        }

        $scope.order = {};
        $scope.order.total = 0;
        $scope.order.items = [];

        $scope.order.week = $routeParams.week;
        $scope.order.nextweek = eval($routeParams.week)+1;
        $scope.order.previousweek = eval($routeParams.week)-1;
        $scope.order.year = $routeParams.year;
        $scope.order.username = $routeParams.username;

        $scope.weeklist = {};
        $scope.weeklist.totals = [];

        $http.get('data/categories.json').success(function(data) {
            $scope.weeklist.categories = data;

            $http.get('data/products.json').success(function(data) {
                $scope.weeklist.items = data;

                for (var i=0;i<$scope.weeklist.items.length;i++){
                 var item = $scope.weeklist.items[i];
                 if (item.category == "Proposte"){
                     $scope.weeklist.categories[0].items.push(item);
                 }else{
                    $scope.weeklist.categories[1].items.push(item);
                 }
                $scope.order.items[item.name] = {qty : 0,
                                                 price : 0,
                                                 priceUnit: '',
                                                 orderUnit: 'pz',
                                                 editMode: false};
                 }

            });
        //once categories and items are loaded asyncronously, items have to be added to categories dynamically
        //??animation???
        });

    });

