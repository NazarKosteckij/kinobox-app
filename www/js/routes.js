angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



.state('main', {
    url: '/main',
    templateUrl: 'templates/main.html',
    controller: 'mainCtrl'
  })

  .state('game', {
    url: '/game',
    templateUrl: 'templates/game.html',
    controller: 'gameCtrl'
  })

  .state('results', {
    url: '/results/:result',
    templateUrl: 'templates/game-results.html',
    controller: 'gameResultsCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })
  .state('bonus', {
    url: '/bonus',
    templateUrl: 'templates/bonus.html',
    controller: 'bonusCtrl'
  })

$urlRouterProvider.otherwise('/login')



});
