angular.module('app.controllers')

/************************************
 *                                  *
 *         BONUS PAGE               *
 *                                  *
 ************************************
 */

.controller('bonusCtrl', function($scope, $state, translationService, $ionicAnalytics) {
  $ionicAnalytics.track('User got bonus');

  $scope.translate = function(){
    translationService.getTranslation($scope, $scope.selectedLanguage);
  };

  $scope.translate();

  $scope.ok = function () {
    $state.go('main');
  }
});
