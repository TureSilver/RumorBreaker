angular.module('my-app').controller('main-controller', function($scope, $window, $http, $q) {
  var host= 'http://localhost:8080';
  var analyzeUrl = '/api/analyzesentiment';
  var findSimilarUrl = '/api/findsimilar';
  var apikey = '0ad13f9a-ee6a-4aa1-bd85-63d9a5832580';


	$scope.name = 'This is a rumor breaker';

	$scope.submit = function() {
    findSimilar($scope.inputText).then(function(documents) {
      console.log('got ' + documents.length + ' similar docs.');
      if (documents.length > 0) {
        $scope.similar = documents;
        analyzeSentiment($scope.similar[0].content).then(function(data) {
          var score = data['aggregate']['score'];
            $scope.probability = ((0.5 + Math.abs(score)) * 100).toString();
            $scope.probability = $scope.probability.substring(0,5) + '%';
        });

      }

    });
  };

  function analyzeSentiment(inputText) {
    var defer = $q.defer();

    var encoded = $window.encodeURI(inputText);

    var url = host + analyzeUrl;

    url += '?language=' + 'chi';
    url += '&text=' + encoded;

    $http.post( url).then(function(res) {
      var documents = res.data;
      defer.resolve(documents);
      console.log('done');
    }, function(e) {
      console.log('[Error]' + e);
    });
    return defer.promise;
  }

  function findSimilar(inputText) {
    var defer = $q.defer();

    var encoded = $window.encodeURI(inputText);

    var url = host + findSimilarUrl;

    url += '?language=' + 'chi';
    url += '&text=' + encoded;
    url += '&indexes=articles';
    url += '&print=all';

    $http.post( url).then(function(res) {
      var documents = res.data['documents'];
      defer.resolve(documents);
      console.log('done');
    }, function(e) {
      console.log('[Error]' + e);
    });
    return defer.promise;
  }
});