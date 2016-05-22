angular.module('my-app').controller('main-controller', function($scope, $window, $http, $q) {
  var host= 'http://localhost:8080';
  var analyzeUrl = '/api/analyzesentiment';
  var findSimilarUrl = '/api/findsimilar';
  var apikey = '0ad13f9a-ee6a-4aa1-bd85-63d9a5832580';


	$scope.name = 'This is a rumor breaker';
	$scope.submit = function() {
    findSimilar($scope.inputText);
  };

  function findSimilar(inputText) {
    var defer = $q.defer();

    var encoded = $window.encodeURI(inputText);

    var url = host + findSimilarUrl;

    url += '?language=' + 'chi';
    url += '&text=' + encoded;
    url += '&indexes=articles';

    $http.post( url).then(function(data) {
      var documents = data['documents'];
      defer.resolve(documents);
      console.log('done');
    }, function(e) {
      console.log('[Error]' + e);
    });
    return defer.promise;
  }
});