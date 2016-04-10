angular.module('app.controllers')

  /************************************
   *
   *         LOGIN PAGE
   *
   ************************************
   */
  .controller('loginCtrl', function($scope, $state, $ionicPopup, $cordovaKeyboard, $cordovaStatusbar, AuthService, translationService){

    $scope.translate = function(){
      translationService.getTranslation($scope, $scope.selectedLanguage);
    };

    $scope.translate();

    if(AuthService.isAuthenticated()){
      //TODO add checking for bonus
      $state.go('main');
    }

    $scope.processingRequest = false;

    $scope.login = function(data) {

      ionic.Platform.fullScreen(true, false);
      if (data.username !== '' && data.password !== '') {
        $scope.processingRequest = true;
        AuthService.login(data.username, data.password)
          .then(function(authenticated) {
            $state.go('main', {}, {reload: true, historyRoot: true});
            $scope.setCurrentUsername(data.username);
            $scope.processingRequest = false;
          }, function(errorMessage) {
            console.log(errorMessage);
            var alertPopup = $ionicPopup.alert({
              title: $scope.translation.login.upps,
              template: errorMessage
            });
            $scope.processingRequest = false;
          });
      } else {
        //TODO add validation error message
      }
    };
  })

