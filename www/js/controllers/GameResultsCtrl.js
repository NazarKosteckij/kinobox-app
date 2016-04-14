angular.module('app.controllers')

  /************************************
   *                                  *
   *         GAME RESULTS PAGE        *
   *                                  *
   ************************************
   */

  .controller('gameResultsCtrl', function($scope, $state, $stateParams, $ionicAnalytics, translationService, PluralizationService) {


  $scope.translate = function(){
    translationService.getTranslation($scope, $scope.selectedLanguage);
  };

  $scope.translate();

    $scope.result = $stateParams.result;
    $scope.ok = function () {
      $state.go('main');
    };

  $scope.pluralize = function (number) {
    return PluralizationService.pluralize(number, $scope.translation.results.points1,  $scope.translation.results.points2, $scope.translation.results.points5)
  };

  console.log($scope);
  $ionicAnalytics.track('Correct and incorrect answers', { correct : $scope.result, wrong: 10 - $scope.result});

  });

