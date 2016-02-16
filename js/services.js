angular.module('pirateBooty.services', [])

.factory('Movies', function($http){
  var views = 0;
  var view = function(){views++; console.log(views);}
  var baseURL = 'https://api.themoviedb.org/3/';
  var apiKey = '2047f691362eca75ead64c4a36d0a0ae';

  var getNew = function(moviesArray){
    $http({
      method: 'GET',
      url: baseURL + 'discover/movie',
      params: {api_key: apiKey,
               'vote_count.gte': '50',
               'release_date.lte': '2016-02-14',
               sort_by: 'release_date.desc',
               page: 1}
    }).then(function success(data){
      for(var i = 0; i < data.data.results.length; i++){
        data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        moviesArray.push(data.data.results[i]);
      };
      $http({
        method: 'GET',
        url: baseURL + 'discover/movie',
        params: {api_key: apiKey,
                 'vote_count.gte': '50',
                'release_date.lte': '2016-02-14',
                 sort_by: 'release_date.desc',
                 page: 2}
      }).then(function success(data){
        for(var i = 0; i < data.data.results.length; i++){
          data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
          moviesArray.push(data.data.results[i]);
        };
        $http({
          method: 'GET',
          url: baseURL + 'discover/movie',
          params: {api_key: apiKey,
                  'vote_count.gte': '50',
                  'release_date.lte': '2016-02-14',
                  sort_by: 'release_date.desc',
                   page: 3}
        }).then(function success(data){
          for(var i = 0; i < data.data.results.length; i++){
            data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
            moviesArray.push(data.data.results[i]);
          };
        }, function error(err){
          console.error(err);
        });
      }, function error(err){
        console.error(err);
      });
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
               sort_by: 'vote_count.desc',
               page: 1}
    }).then(function success(data){
      for(var i = 0; i < data.data.results.length; i++){
        data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        moviesArray.push(data.data.results[i]);
      };
      $http({
        method: 'GET',
        url: baseURL + 'discover/movie',
        params: {api_key: apiKey,
                 'release_date.lte': '2016-02-14',
                 sort_by: 'vote_count.desc',
                 page: 2}
      }).then(function success(data){
        for(var i = 0; i < data.data.results.length; i++){
          data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
          moviesArray.push(data.data.results[i]);
        };
        $http({
          method: 'GET',
          url: baseURL + 'discover/movie',
          params: {api_key: apiKey,
                   'release_date.lte': '2016-02-14',
                   sort_by: 'vote_count.desc',
                   page: 3}
        }).then(function success(data){
          for(var i = 0; i < data.data.results.length; i++){
            data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
            moviesArray.push(data.data.results[i]);
          };
        }, function error(err){
          console.error(err);
        });
      }, function error(err){
        console.error(err);
      });
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
               'vote_count.gte': '100',
               'release_date.lte': '2016-02-14',
               sort_by: 'vote_average.desc',
               page: 1}
    }).then(function success(data){
      for(var i = 0; i < data.data.results.length; i++){
        data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        moviesArray.push(data.data.results[i]);
      };
      $http({
        method: 'GET',
        url: baseURL + 'discover/movie',
        params: {api_key: apiKey,
                 'vote_count.gte': '100',
                'release_date.lte': '2016-02-14',
                 sort_by: 'vote_average.desc',
                 page: 2}
      }).then(function success(data){
        for(var i = 0; i < data.data.results.length; i++){
          data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
          moviesArray.push(data.data.results[i]);
        };
        $http({
          method: 'GET',
          url: baseURL + 'discover/movie',
          params: {api_key: apiKey,
                  'vote_count.gte': '100',
                  'release_date.lte': '2016-02-14',
                  sort_by: 'vote_average.desc',
                   page: 3}
        }).then(function success(data){
          for(var i = 0; i < data.data.results.length; i++){
            data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
            moviesArray.push(data.data.results[i]);
          };
        }, function error(err){
          console.error(err);
        });
      }, function error(err){
        console.error(err);
      });
      console.log(moviesArray)
    }, function error(err){
      console.error(err);
    });
  };

  var search = function(title, moviesArray){
    $http({
      method: 'GET',
      url: baseURL + 'search/movie',
      params: {api_key: apiKey,
               query: title}
    }).then(function success(data){
      for(var i = 0; i < data.data.results.length; i++){
        data.data.results[i].watchTitle = data.data.results[i].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        moviesArray.push(data.data.results[i]);
        moviesArray.sort(function(a, b){
          return b.vote_count - a.vote_count;
        });
      };
      console.log(moviesArray)
    }, function error(err){
      console.error(err);
    });
  };

  return {
    view: view,
    getNew: getNew,
    getVoted: getVoted,
    getRated: getRated,
    search: search
  }
})
.factory('Watch', function(){
  var position = 0;

  var getPosition = function(){
    return position;
  }

  var increment = function(){
    position++;
  }

  var decrement = function(){
    position--;
  }

  var getSource = function(title){
    return "/watch/" + position + '/' + title;
  }

  var generateList = function(title){
  }

  return {
    getSource: getSource,
    increment: increment,
    decrement: decrement,
    getPosition: getPosition
  };
});