angular.module('app', ['wakanda'])
.service('WakandaManager', function($q, $wakanda) {
				var _this = this;
				var initPromise = $wakanda.init();
				this.$wakanda = $wakanda;
				this.ready = function() {
								var deferred = $q.defer();
								initPromise
								.then(function() {
												deferred.resolve(_this);
								})
								.catch(function(e) {
												deferred.reject(e);
								});
								return deferred.promise;
				};
})

.controller('TodoController', function($scope, WakandaManager) {
				WakandaManager.ready().then(function () {
								var ds = WakandaManager.$wakanda.$ds;
								ds.Todo.$all().$promise.then(function(event) {
												$scope.todos = event.result;
								});

								$scope.newItem = '';

								$scope.addItem = function() {
												if ($scope.newItem.length > 0) {
																var entity = ds.Todo.$create();
																entity.title = $scope.newItem;
																entity.done = false;
																entity.$save().$promise.then(function() {
																				$scope.todos.push(entity);
																				$scope.newItem = '';
																})
												}
								};

        $scope.checkItem = function(item) {
            item.done = !item.done;
            item.$save();
        };

        $scope.deleteItem = function(item) {
            var index = $scope.todos.indexOf(item);
            item.$remove().$promise.then(function() {
                $scope.todos.splice(index, 1);
            });
        };
								
				});
});


