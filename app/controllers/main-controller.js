angular.module('my-app').controller('main-controller', function($scope, $window, $http) {
  var host= 'http://localhost:8080';
  var analyzeUrl = '/api/analyzesentiment';
  var apikey = '0ad13f9a-ee6a-4aa1-bd85-63d9a5832580';


	$scope.name = 'This is a rumor breaker';
	$scope.submit = function() {
    var encoded = $window.encodeURI($scope.inputText);
    $http.post(host + analyzeUrl, {
      apikey: apikey,
      text: encoded,
      language: 'chi'
    }).then(function() {
      console.log('done');
    }, function(e) {
      console.log('[Error]' + e);
    });
};
});