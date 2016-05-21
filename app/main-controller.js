angular.module('my-app').controller('main-controller', function($scope, $window, $http) {
  var host= 'localhost';
  var analyzeUrl = '/1/api/sync/analyzesentiment/v1';


	$scope.name = 'This is a rumor breaker';
	$scope.submit = function() {
    var encoded = $window.encodeURI($scope.inputText);
    $http.post('http://localhost' + analyzeUrl, {
      text: encoded,
      language: 'chi'
    }).then(function() {
      console.log('done');
    }, function(e) {
      console.log('[Error]' + e);
    });
};
});