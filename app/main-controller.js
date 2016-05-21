angular.module('my-app').controller('main-controller', function($scope, $http) {
  var host= 'localhost';
  var analyzeUrl = '/1/api/sync/analyzesentiment/v1';


	$scope.name = 'This is a rumor breaker';
	$scope.submit = function() {
		console.log($scope.inputText);
	};
});