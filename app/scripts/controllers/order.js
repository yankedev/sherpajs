'use strict';

sherpa.controller('OrderCtrl', function ($scope, $routeParams, $http, $filter, Orders, SherpaService, OrderService) {

    this.increaseQty = function(item, category){
        var orderItem = OrderService.getCurrentOrder().getitem(item.name);
        if (item.step){
            orderItem.qty += item.step;
        }else{
            orderItem.qty += 1;
        }
    };

    this.decreaseQty = function(item, category){
        var orderItem = OrderService.getCurrentOrder().getitem(item.name);
        if (item.step){
            orderItem.qty -= item.step;
        }else{
            orderItem.qty -= 1;
        }
    };

    this.toggleEditMode = function(item){
        var itemEditMode = !OrderService.getCurrentOrder().getitem(item.name).editMode;
        OrderService.getCurrentOrder().getitem(item.name).editMode = itemEditMode;
    };

    this.getTotals = function(category){
        return OrderService.getTotal(category.name);
    }

    this.calculateTotals = function(category){
        return OrderService.calculateTotals(category);
    }

    this.calculateOrderTotal = function(category){
        return OrderService.calculateOrderTotal(category);
    }

    this.getIndex = function(category){
        return category.index;
    }

    $scope.order = OrderService.getCurrentOrder();
    $scope.tabindex = 0;

    $scope.$watch('order', function() {
        angular.forEach($scope.weeklist.categories, function(category){
            OrderService.calculateTotals(category);
        })
        OrderService.calculateOrderTotal(categories);
    }); // initialize the watch


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

