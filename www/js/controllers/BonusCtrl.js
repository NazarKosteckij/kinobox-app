angular.module('app.controllers')

/************************************
 *                                  *
 *         BONUS PAGE               *
 *                                  *
 ************************************
 */

.controller('bonusCtrl', function($scope, $state, translationService, $window, $location, $ionicAnalytics) {
  $ionicAnalytics.track('User got bonus');
  $window.ga('send', 'pageview', { page: 'MOBILE-APP/#' + $location.url() });

  $scope.translate = function(){
    translationService.getTranslation($scope, $scope.selectedLanguage);
  };

  $scope.translate();

  $scope.ok = function () {
    $state.go('main');
  }
});
