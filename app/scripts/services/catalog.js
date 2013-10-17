'use strict';
angular.module('SherpaService', ['ngResource'])
.factory('SherpaService', function($http){
        return {
            getCatalog: function() {
                $http.get('data/categories.json').success(function(data) {
                    $scope.weeklist.categories = data;

                    $http.get('data/w'+$scope.order.week+'/products.json').success(function(data) {
                        $scope.weeklist.items = data;

                        for (var i=0;i<$scope.weeklist.items.length;i++){
                            var item = $scope.weeklist.items[i];
                            var cat = getCategory($scope, item.category);
                            cat.items.push(item);
                            var orderItem =  {name : item.name,
                                qty : 0,
                                price : 0,
                                priceUnit: '',
                                orderUnit: 'pz',
                                editMode: false};
                            $scope.order.items.push(orderItem);
                        }

                    });
                    //once categories and items are loaded asyncronously, items have to be added to categories dynamically
                    //??animation???
                });
            }
        };
    });