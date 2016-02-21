angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('page1', {
    url: '/main',
    templateUrl: 'templates/page1.html',
    controller: 'page1Ctrl'
  })

  .state('game', {
    url: '/game',
    templateUrl: 'templates/game.html',
    controller: 'gameCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

$urlRouterProvider.otherwise('/login')



});
