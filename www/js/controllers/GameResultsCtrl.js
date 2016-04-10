angular.module('app.controllers')

  /************************************
   *                                  *
   *         GAME RESULTS PAGE        *
   *                                  *
   ************************************
   */

  .controller('gameResultsCtrl', function($scope, $state, $stateParams, $ionicAnalytics, translationService) {


  $scope.translate = function(){
    translationService.getTranslation($scope, $scope.selectedLanguage);
  };

  $scope.translate();

    $scope.result = $stateParams.result;
    $scope.ok = function () {
      $state.go('main');
    };

  console.log($scope);
  $ionicAnalytics.track('Correct and incorrect answers', { correct : $scope.result, wrong: 10 - $scope.result});

  });

