// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ionicProcessSpinner', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.run(function($cordovaSplashscreen) {
  setTimeout(function() {
    $cordovaSplashscreen.hide()
  }, 5000)
})
  .run(function($cordovaPush, $rootScope) {

    var androidConfig = {
      "senderID": "119817321606",
    };

    document.addEventListener("deviceready", function(){
      $cordovaPush.register(androidConfig).then(function(result) {
        // Success
      }, function(err) {
        // Error
      });

      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        switch(notification.event) {
          case 'registered':
            if (notification.regid.length > 0 ) {
              console.log('registration ID = ' + notification.regid);
            }
            break;

          case 'message':
            // this is the actual push notification. its format depends on the data model from the push server
            alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
            break;

          case 'error':
            alert('GCM error = ' + notification.msg);
            break;

          default:
            alert('An unknown GCM event has occurred');
            break;
        }
      });


      // WARNING: dangerous to unregister (results in loss of tokenID)
      $cordovaPush.unregister(options).then(function(result) {
        // Success!
      }, function(err) {
        // Error
      })

    }, false);
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

.constant('USER_ROLES', {
  public: 'public_role'
});
