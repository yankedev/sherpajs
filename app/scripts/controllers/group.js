'use strict';



function calculateItemPrice(item){
     return item.qty * item.price;
}

   sherpa.controller('GroupCtrl', function ($scope, $routeParams, $http, $filter, Orders) {


       $scope.groupOrder = {};
       $scope.groupOrder.week = week;
       $scope.groupOrder.groupId = groupId;
       $scope.groupOrder.participants = [];
       $scope.groupOrder.items = {};


        // We can retrieve a collection from the server
        // GET: /sherpadb/collections/orders?apiKey=...&q=%7B%22week%22:%2232%22,+%22groupId%22:%22evelyne%22%7D
        var week = $routeParams.week;
        var groupId = $routeParams.groupId;
        $scope.ordersDb = Orders.query({q:'{"week":"'+ week +'", "groupId":"'+groupId+'"}'},function(data){
            angular.forEach(data, function(order){
                if ($scope.groupOrder.participants.indexOf(order.username) == -1){
                    $scope.groupOrder.participants.push(order.username);
                }

                angular.forEach(order.items, function(item){
                    if (!$scope.groupOrder.items[item.name]) {
                        $scope.groupOrder.items[item.name] =  {name : item.name,
                                                                qty : item.qty,
                                                                price : item.price,
                                                                priceUnit: item.priceUnit,
                                                                orderUnit: item.orderUnit,
                                                                total: calculateItemPrice(item)
                                                              };
                    }else{
                        var currentItem = $scope.groupOrder.items[item.name];
                        currentItem['qty'] += item.qty;
                        currentItem.total += calculateItemPrice(item);
                    }
                });
            });
        });



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
            var itemEditMode = !$scope.order.getitem(item.name).editMode;
            $scope.order.getitem(item.name).editMode = itemEditMode;
        };

        $scope.calculateTotals = function(category){
            var catTotal = 0;
            angular.forEach(category.items, function(item){
                var qty = $scope.order.getitem(item.name).qty;
                var price = item.price;
                var totalItem = qty*price;
                $scope.order.getitem(item.name).price = totalItem;
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

        $scope.saveOrder = function(){
            var filteredItems = $.grep($scope.order.items, function(e){
                return e.qty != 0;
            });
            $scope.order.items = filteredItems;
            console.log("success: "+$filter('json')($scope.order));
            //console.log("details: "+$filter('json')(filteredItems));
            Orders.save($scope.order);
        }
    });

