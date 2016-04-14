  angular.module('app.controllers')

  /************************************
   *                                  *
   *            MAIN PAGE             *
   *                                  *
   ************************************
   */
  .controller('mainCtrl',
    function ($rootScope, $stateParams, $window, $scope, $state, $http,
              $ionicAnalytics, $ionicPopup, $ionicHistory,
              AuthService, ProfileService, GameService, translationService,
              PluralizationService) {

  $scope.translate = function(){
    translationService.getTranslation($scope);
    $scope.isUkrainianLang = translationService.getSelectedLanguage() === 'uk';
  };
  var _processingRequest = false;
  var _avatarTaps = 0;
  var _haroldIntervalId;
  $scope.haroldPosition = 200;

  var _moveHarold = function () {
    if ($scope.haroldPosition === -100) {
      clearInterval(_haroldIntervalId);
      $scope.haroldPosition = 200;
    }

    if ($scope.haroldPosition !== 0) {
      $scope.$apply(function () {
        _calculateHaroldPosition();
      });
    } else {
      clearInterval(_haroldIntervalId);
      setTimeout(function () {
        $scope.$apply(function () {
          $scope.haroldPosition = 200;
        })
      }, 3000);
    }

  };

  var _calculateHaroldPosition = function() {
   $scope.haroldPosition-- ;
  }

  $scope.hiHarold = function() {
    if(_avatarTaps++ === 15) {
      $ionicAnalytics.track('Users saw Harold',{user: $scope.user});
      _haroldIntervalId = setInterval(_moveHarold, 10);
      _avatarTaps = 0;
    }
  };
      $scope.playBtn = function(){
        if (_processingRequest) {
          return;
        }

        _processingRequest = true;
        GameService.isGameAllowed()
          .then(function (gameStatus) {
              _processingRequest = false;
              console.log(gameStatus);
              if (gameStatus.allowed) {
                $state.go("game", {reload: true});
              } else {
                if (gameStatus.timeToStart.minutes === 0 && gameStatus.timeToStart.hours === 0 && gameStatus.timeToStart.seconds === 0) {
                  GameService.finishGame({finish_type: 'reset'});
                  $ionicPopup.alert({
                    title: 'Упс!',
                    template: 'Остання гра була некоректно завершена!'
                  });
                } else {
                  //TODO maybe it will be better when move this transforming logic into service
                  var hours = gameStatus.timeToStart.hours;
                  var minutes = gameStatus.timeToStart.minutes < 10 ? '0' + gameStatus.timeToStart.minutes : gameStatus.timeToStart.minutes;
                  var seconds = gameStatus.timeToStart.seconds < 10 ? '0' + gameStatus.timeToStart.seconds : gameStatus.timeToStart.seconds;
                  $ionicPopup.alert({
                    title: $scope.translation.main.upps,
                    template: $scope.translation.main.gameStartAfter + hours + ':'
                    + minutes + ':' + seconds
                  });
                }
              }
            },
            function (error) {
              _processingRequest = false;
              $ionicPopup.alert({
                title: $scope.translation.main.upps,
                template: $scope.translation.main.netError
              });
            });
      };

    //TODO add ionic users here
    ProfileService.loadUser();
    $scope.user = ProfileService.user;
    console.log($scope.user);

      $ionicAnalytics.track('User runed app',{user: $scope.user});

    $scope.logout = function () {
      $ionicAnalytics.track('User Logged out',{user: $scope.user});

      AuthService.logout();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });

      console.log("loggedOut");
      $state.go('login', {reload: true});
    };

  var _setLanguage = function (lang) {
    $ionicAnalytics.track('Language changed',{language: lang});
    console.log("Language changed " + lang);
    if (lang) {
      window.localStorage['language'] = lang;
    }
    $scope.translate();
  };

  $scope.translate();

  $scope.setLangUk = function () {
    _setLanguage("uk");
  };
  $scope.setLangRu = function () {
    _setLanguage("ru");
  };

  $scope.pluralize = function (number) {
    return PluralizationService.pluralize(number, $scope.translation.main.points1,  $scope.translation.main.points2, $scope.translation.main.points5)
  };

})
