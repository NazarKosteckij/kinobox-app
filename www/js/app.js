// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ionic.service.core', 'ionic.service.analytics', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngResource', 'ionicProcessSpinner', 'ngCordova'])

.run(function($ionicPlatform, $ionicAnalytics) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    $ionicAnalytics.register();
    $ionicAnalytics.track('App runed');

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','lib/analytics.js','ga');

    ga('create', 'UA-48884370-1', 'auto');
    ga('send', 'androidApp');


    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScrollingInShrinkView(false);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    $cordovaStatusbar.overlaysWebView(true);
    $cordovaStatusbar.hide()
  });
})
.run(function($cordovaSplashscreen) {
  setTimeout(function() {
    $cordovaSplashscreen.hide()
  }, 5000)
})
//Angular mocks
/*.run(function($httpBackend){
  $httpBackend.whenGET(/templates\/\w+.*!/).passThrough();
  $httpBackend.whenPOST(/https:\/\/kinobox.in.ua\/.*!/).passThrough();
  $httpBackend.whenGET(/https:\/\/kinobox.in.ua\/.*!/).passThrough();

})*/

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
