angular.module('pirateBooty', ['ui.router', 'pirateBooty.services', 'pirateBooty.movies'])

.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/movies')

  $stateProvider
    .state('movies', {
      url: '/movies',
      templateUrl: '/templates/_movies.html',
      controller: 'MoviesController'
    })
    .state('load', {
      url:'/load/:title',
      templateUrl: '/templates/_load.html',
      controller: 'LoadController'
    })
    .state('watch', {
      url:'/watch/:title',
      templateUrl: '/templates/_watch.html',
      controller: 'WatchController'
    })
    .state('session', {
      url:'/session/:name',
      templateUrl: '/templates/_session.html',
      controller: 'SessionController'
    });
});