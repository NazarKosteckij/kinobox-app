function isPortraitOrientation(){
  return Math.abs(window.screen.width) < Math.abs(window.screen.height);
  //TODO (DEBUG ONLY) remove it
  //return  !(Math.random() + .5 | 0);
}


angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



.state('page1', {
    url: '/main',
    templateUrl: function() { return isPortraitOrientation() ? 'templates/page1.html' : 'templates/main_landscape.html'},
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
  .state('bonus', {
    url: '/bonus',
    templateUrl: 'templates/bonus.html',
    controller: 'bonusCtrl'
  })

$urlRouterProvider.otherwise('/login')



});
