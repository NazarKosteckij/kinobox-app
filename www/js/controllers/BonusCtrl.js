angular.module('app.controllers')

/************************************
 *                                  *
 *         BONUS PAGE               *
 *                                  *
 ************************************
 */

.controller('bonusCtrl', function($scope, $state){
  $scope.ok = function () {
    $state.go('main');
  }
});
