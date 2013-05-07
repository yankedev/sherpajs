// This is a module for cloud persistance in mongolab - https://mongolab.com
var mongolab = angular.module('mongolab', ['ngResource']);
mongolab.factory('Categories', function($resource) {
    https://api.mongolab.com/api/1/databases/sherpadb/collections?apiKey=509acf3de4b0f2aa6bbd0607
      var Category = $resource('https://api.mongolab.com/api/1/databases' +
          '/sherpadb/collections/category/:id',
          { apiKey: '509acf3de4b0f2aa6bbd0607' }, {
            update: { method: 'PUT' }
          }
      );
        Category.prototype.update = function(cb) {
        return Category.update({id: this._id.$oid},
            angular.extend({}, this, {_id:undefined}), cb);
      };

        Category.prototype.destroy = function(cb) {
        return Category.remove({id: this._id.$oid}, cb);
      };
 
      return Category;
    });

mongolab.factory('Items', function($resource) {
    https://api.mongolab.com/api/1/databases/sherpadb/collections?apiKey=509acf3de4b0f2aa6bbd0607
        var Item = $resource('https://api.mongolab.com/api/1/databases' +
            '/sherpadb/collections/item/:id',
            { apiKey: '509acf3de4b0f2aa6bbd0607' }, {
                update: { method: 'PUT' }
            }
        );
    Item.prototype.update = function(cb) {
        return Item.update({id: this._id.$oid},
            angular.extend({}, this, {_id:undefined}), cb);
    };

    Item.prototype.destroy = function(cb) {
        return Item.remove({id: this._id.$oid}, cb);
    };

    return Item;
});

mongolab.factory('Orders', function($resource) {
      var Order = $resource('https://api.mongolab.com/api/1/databases' +
          '/sherpadb/collections/orders/:id',
          { apiKey: '509acf3de4b0f2aa6bbd0607' }, {
            update: { method: 'PUT' }
            //,headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
          }
      );
        Order.prototype.update = function(cb) {
        return Order.update({id: this._id.$oid},
            angular.extend({}, this, {_id:undefined}), cb);
      };

        Order.prototype.destroy = function(cb) {
        return Order.remove({id: this._id.$oid}, cb);
      };
 
      return Order;
    });
	