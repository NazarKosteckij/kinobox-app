angular.module('app.controllers')

  /************************************
   *                                  *
   *         GAME RESULTS PAGE        *
   *                                  *
   ************************************
   */

  .controller('gameResultsCtrl', function($scope, $state, $stateParams){
    $scope.result = $stateParams.result;
    $scope.ok = function () {
      $state.go('main');
    }
  });
