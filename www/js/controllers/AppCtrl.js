angular.module('app.controllers', [])

.controller('appCtrl',function($scope, $ionicHistory, $state, $ionicPopup, AuthService, AUTH_EVENTS, translationService) {

  $scope.translate = function(){
    translationService.getTranslation($scope, $scope.selectedLanguage);
  };

  $scope.translate();

  $scope.username = AuthService.username();
  if(AuthService.isAuthenticated()){
    $state.go('main', {reload: true});
  } else {
    $state.go('login', {reload: true});
  }
  $scope.$on("$ionicView.afterLeave", function () {
    $ionicHistory.clearCache();
  });
  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login', {reload: true});
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})

