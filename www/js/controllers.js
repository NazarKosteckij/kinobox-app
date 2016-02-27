angular.module('app.controllers', [])

.controller('appCtrl',function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();

  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})


/************************************
 *
 *         MAIN PAGE
 *
 ************************************
 */
.controller('page1Ctrl', function ($scope, $state, $http, $ionicPopup, $ionicHistory, AuthService, ProfileService) {
  ProfileService.loadUser();
  $scope.user = ProfileService.user;
  console.log($scope.user);

  $scope.logout = function () {
    AuthService.logout();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({
      historyRoot: true
    });
    console.log("loggedOut");
    $state.go('login');
  };
})

/************************************
 *
 *         GAME PAGE
 *
 ************************************
 */
.controller('gameCtrl', function($scope) {

})


/************************************
 *
 *         LOGIN PAGE
 *
 ************************************
 */
.controller('loginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  if(AuthService.isAuthenticated()){
    $state.go('page1');
  }

  $scope.login = function(data) {
    AuthService.login(data.username, data.password).then(function(authenticated) {
      $state.go('page1', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(errorMessage) {
      console.log(errorMessage);
      var alertPopup = $ionicPopup.alert({
        title: 'Упс!',
        template: errorMessage
      });
    });
  };
})
