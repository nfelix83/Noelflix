angular.module('pirateBooty.movies', [])

.controller('MoviesController', function ($scope, Movies){
  $scope.init = function () {
    $scope.top();
  }

  $scope.fresh = function(){
    console.log(Movies.view());
    $('.active').removeClass('active');
    $('#fresh').addClass('active');
    $scope.movies = [];
    Movies.getNew($scope.movies);
  }

  $scope.popular = function(){
    $('.active').removeClass('active');
    $('#popular').addClass('active');
    $scope.movies = [];
    Movies.getVoted($scope.movies);
  }

  $scope.top = function(){
    $('.active').removeClass('active');
    $('#top').addClass('active');
    $scope.movies = [];
    Movies.getRated($scope.movies);
  }

  $scope.thumbsUp = function(rating){
    var thumbs = Math.round(rating);
    var ret = [];
    for(var i = 0; i < thumbs; i++){
      ret.push(i);
    }
    return ret;
  }

  $scope.thumbsDown = function(rating){
    var thumbs = 10 - Math.round(rating);
    var ret = [];
    for(var i = 0; i < thumbs; i++){
      ret.push(i);
    }
    return ret;
  }

  $scope.init();
});