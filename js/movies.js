angular.module('pirateBooty.movies', [])

.controller('MoviesController', function ($scope, $window, Movies){
  $scope.searchType = 'title';
  $scope.searchParam = '';

  $scope.init = function () {
    $scope.top();
  }

  $scope.fresh = function(){
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

  $scope.setToTitle = function(){
    $scope.searchType = 'title';
  }

  $scope.setToTorrent = function(){
    $scope.searchType = 'torrent';
  }

  $scope.search = function(){
    if($scope.searchType === 'torrent'){
      $window.location.href = '#/load/' + $scope.searchParam;
    } else {
      $scope.movies = [];
      Movies.search($scope.searchParam, $scope.movies);
    }
  }

  $scope.init();
})

.controller('WatchController', function($compile, $scope, $stateParams, $window, Watch){

  $scope.getSource = function(){
    return Watch.getSource($stateParams.title);
  }
  $scope.next = function(){
    socket.emit('getVideoArrayLength');
    socket.on('videoArrayLength', function(length){
      if($scope.getPosition() < length - 1){
        Watch.increment();
        var video = document.getElementById('playing');
        video.src = '' + $scope.getSource();
        video.play();
      } else {
        Materialize.toast('This is the last video.', 4000);
      }
    });
  }
  $scope.prev = function(){
    if($scope.getPosition() > 0){
      Watch.decrement();
      var video = document.getElementById('playing');
      video.src = '' + $scope.getSource();
      video.play();
    } else {
      Materialize.toast('This is the first video.', 4000);
    }
  }
  $scope.getPosition = function(){
    return Watch.getPosition();
  }
})

.controller('LoadController', function($stateParams, $window){
  socket.emit('generateList', $stateParams.title);
  socket.on('built', function(){
    $window.location.href = '#/watch/' + $stateParams.title;
  });
});