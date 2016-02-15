angular.module('pirateBooty.services', [])

.factory('Movies', function($http){
  var baseURL = 'http://api.themoviedb.org/3/';
  var apiKey = '2047f691362eca75ead64c4a36d0a0ae';

  var getNew = function(moviesArray){
    $http({
      method: 'GET',
      url: baseURL + 'discover/movie',
      params: {api_key: apiKey,
               'vote_count.gte': '50',
               'release_date.lte': '2016-02-14',
               sort_by: 'release_date.desc'}
    }).then(function success(data){
      for(var i = 0; i < data.data.results.length; i++){
        data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        moviesArray.push(data.data.results[i]);
      };
      console.log(moviesArray)
    }, function error(err){
      console.error(err);
    });
  };

  var getVoted = function(moviesArray){
    $http({
      method: 'GET',
      url: baseURL + 'discover/movie',
      params: {api_key: apiKey,
               'release_date.lte': '2016-02-14',
               sort_by: 'vote_count.desc'}
    }).then(function success(data){
      for(var i = 0; i < data.data.results.length; i++){
        data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        moviesArray.push(data.data.results[i]);
      };
      console.log(moviesArray)
    }, function error(err){
      console.error(err);
    });
  };

  var getRated = function(moviesArray){
    $http({
      method: 'GET',
      url: baseURL + 'discover/movie',
      params: {api_key: apiKey,
               'vote_count.gte': '50',
               'release_date.lte': '2016-02-14',
               sort_by: 'vote_average.desc'}
    }).then(function success(data){
      for(var i = 0; i < data.data.results.length; i++){
        data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        moviesArray.push(data.data.results[i]);
      };
      console.log(moviesArray)
    }, function error(err){
      console.error(err);
    });
  };

  return {
    getNew: getNew,
    getVoted: getVoted,
    getRated: getRated
  }
});