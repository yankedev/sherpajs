'use strict';

sherpa.controller('OrderCtrl', function ($scope, $routeParams, $http, $filter, Orders, SherpaService) {

    this.increaseQty = function(item, category){
        var orderItem = $scope.order.getitem(item.name);
        if (item.step){
            orderItem.qty += item.step;
        }else{
            orderItem.qty += 1;
        }
        this.calculateTotals(category);
    };

    this.decreaseQty = function(item, category){
        var orderItem = $scope.order.getitem(item.name);
        if (item.step){
            orderItem.qty -= item.step;
        }else{
            orderItem.qty -= 1;
        }
        this.calculateTotals(category);
    };

    this.toggleEditMode = function(item){
        var itemEditMode = !$scope.order.getitem(item.name).editMode;
        $scope.order.getitem(item.name).editMode = itemEditMode;
    };

    this.getTotals = function(category){
        return $scope.weeklist.totals[category.name];
    }
    this.calculateTotals = function(category){
        var catTotal = 0;
        angular.forEach(category.items, function(item){
            var qty = $scope.order.getitem(item.name).qty;
            var price = item.price;
            var totalItem = qty*price;
            $scope.order.getitem(item.name).price = totalItem;
            catTotal = catTotal + totalItem;
        });
        $scope.weeklist.totals[category.name] = catTotal;
        this.calculateOrderTotal();
        return catTotal;
    };

    this.calculateOrderTotal = function(){
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

    $scope.order.getitem = function(name){
        var result= $.grep($scope.order.items, function(e){
            return e.name == name;
        });
        return result[0];
    }

    $scope.order.week = $routeParams.week;
    $scope.order.nextweek = eval($routeParams.week)+1;
    $scope.order.previousweek = eval($routeParams.week)-1;
    $scope.order.year = $routeParams.year;
    $scope.order.username = $routeParams.username;
    $scope.order.groupId = $routeParams.groupId;

    $scope.weeklist = {};
    $scope.weeklist.totals = [];

    SherpaService.getCatalog($scope.order.week, function(categories, orderItems){
        $scope.weeklist.categories = categories;
        $scope.order.items = orderItems;
    });

    this.saveOrder = function(){
        var filteredItems = $.grep($scope.order.items, function(e){
            return e.qty != 0;
        });
        $scope.order.items = filteredItems;
        console.log("success: "+$filter('json')($scope.order));
        //console.log("details: "+$filter('json')(filteredItems));
        Orders.save($scope.order);
    }
});

