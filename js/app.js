angular.module('pirateBooty', ['ui.router', 'pirateBooty.services', 'pirateBooty.movies'])

.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/movies')

  $stateProvider
    .state('movies', {
      url: '/movies',
      templateUrl: '/templates/movies.html',
      controller: 'MoviesController'
    });
});