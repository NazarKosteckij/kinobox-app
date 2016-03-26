angular.module('app.controllers')

  /************************************
 *                                  *
 *            MAIN PAGE             *
 *                                  *
 ************************************
 */
.controller('mainCtrl', function ($rootScope, $stateParams, $window, $scope, $state, $http, $ionicPopup, $ionicHistory, AuthService, ProfileService, GameService) {
  $scope.playBtn = function(){
    GameService.isGameAllowed()
      .then(function (gameStatus) {
          if (gameStatus.allowed) {
            $state.go("game", {reload: true});
          } else {
            //TODO maybe it will be better when move this transforming logic into service
            var hours = gameStatus.timeToStart.hours;
            var minutes = gameStatus.timeToStart.minutes < 10 ? '0' + gameStatus.timeToStart.minutes : gameStatus.timeToStart.minutes;
            var seconds = gameStatus.timeToStart.seconds < 10 ? '0' + gameStatus.timeToStart.seconds : gameStatus.timeToStart.seconds;
            $ionicPopup.alert({
              title: 'Упс!',
              template: 'Гра буде доступна через ' + hours + ':'
              + minutes + ':' + seconds
            });
          }
        },
        function (error) {
          $ionicPopup.alert({
            title: 'Упс!',
            template: 'Немає з\'вязку з сервером.'
          });
        });
  };

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
    $state.go('login', {reload: true});
  };
})
