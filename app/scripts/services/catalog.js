'use strict';
angular.module('SherpaService', ['ngResource'])
.factory('SherpaService', function($http){
        return {
            getCatalog: function(week, callback) {
                $http.get('data/categories.json').success(function(data) {
                    var categories = data;

                    $http.get('data/w'+week+'/products.json').success(function(items) {
                        var orderItems = [];
                        for (var i=0;i<items.length;i++){
                            var item = items[i];

                            var cat = getCategory(categories, item.category);
                            cat.items.push(item);
                            var orderItem =  {name : item.name,
                                qty : 0,
                                price : 0,
                                priceUnit: '',
                                orderUnit: 'pz',
                                editMode: false};
                            orderItems.push(orderItem);
                        }
                        callback(categories, orderItems);
                    });
                    //once categories and items are loaded asyncronously, items have to be added to categories dynamically
                    //??animation???
                });
            }
        };
    });