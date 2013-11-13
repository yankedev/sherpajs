'use strict';
angular.module('OrderService2', ['ngResource'])
.factory('OrderService', function($http){

        //Singleton properties available for the whole app
        var currentOrder = {};
        currentOrder.total = 0;
        currentOrder.items = [];
        currentOrder.getitem = function(name){
            var result= $.grep(this.items, function(e){
                return e.name == name;
            });
            return result[0];
        }

        var weeklist = {};
        weeklist.totals = [];

        return {
            getCurrentOrder :  function(){
                return currentOrder;
            },
            getTotal :  function(categoryName){
                return weeklist.totals[categoryName];
            },
            //TODO: rename function to calculateTotal
            calculateTotals : function(category){
                var catTotal = 0;
                angular.forEach(category.items, function(item){
                    var qty = currentOrder.getitem(item.name).qty;
                    var price = item.price;
                    var totalItem = qty*price;
                    currentOrder.getitem(item.name).price = totalItem;
                    catTotal = catTotal + totalItem;
                });
                weeklist.totals[category.name] = catTotal;
                return catTotal;
            },

            calculateOrderTotal : function(categories){
                var orderTotal = 0;
                angular.forEach(categories, function(category){
                    var catTotal = weeklist.totals[category.name]
                    if (catTotal != null)
                        orderTotal = orderTotal + catTotal;
                });
                return orderTotal;
            }

        };
    });