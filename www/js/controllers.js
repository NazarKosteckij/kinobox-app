angular.module('app.controllers', [])

.controller('appCtrl',function($scope, $ionicHistory, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();
  if(AuthService.isAuthenticated()){
    $state.go('page1', {reload: true});
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


/************************************
 *                                  *
 *            MAIN PAGE             *
 *                                  *
 ************************************
 */
.controller('page1Ctrl', function ( $scope, $state, $http, $ionicPopup, $ionicHistory, AuthService, ProfileService, GameService) {
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

/************************************
 *
 *         GAME PAGE
 *
 ************************************
 */
.controller('gameCtrl', function ($document, $ionicPopup, $log, $scope, $state, GameService) {
  const SECONDS_PER_SLIDE = 15;
  const TIMER_UPDATE_INTERVAL = 10;
  const _slideData = {
    image: 'https://kinobox.in.ua/frames/53b7b6e261a04_1404548834.jpg',
    variants: ['asdfa', 'asdfa', 'asfdas', 'asdfasf'],
    submit: false,
    correct: false
  };

  var _currentSlideIndex = 0;
  var _remainingTimeMs = 0;
  var _intervalId = 0;

  $scope.submit = function () {
    if (!_isEndOfGame()) {
      $scope.slides[_currentSlideIndex - 1] = {
        // TODO temporary random! Delete it when game will be done!!!
        submit: true,
        correct: !(Math.random() + .5 | 0)
      };

      _loadNextSlide();
    }  else {
      clearInterval(_intervalId);
      setTimeout(_endGame, 1000);
    }
  };

  var _initTimer = function() {
    _remainingTimeMs = SECONDS_PER_SLIDE * 1000;
  };

  var _updateTimer = function () {
    if (_currentSlideIndex <= 10) {
      if (_remainingTimeMs > TIMER_UPDATE_INTERVAL) {
        _remainingTimeMs -= TIMER_UPDATE_INTERVAL;
        _render();
      } else {
        //TODO stop the timer
        _loadNextSlide();
        console.log("Time limit reached");
      }
    }
  };

  var _initProgressBar = function () {
    for (var i = 0; i < 10; i++) {
      $scope.slides[i] = _slideData;
    }
  };

  var _prepareNextSlide = function () {
    if (!_isEndOfGame()) {
      _initTimer();
    }
  };

  var _isEndOfGame = function () {
    return _currentSlideIndex > 9;
  };
  var _render = function() {
    document.getElementsByClassName("countdown-timer")[0].style = "width:" + (_remainingTimeMs/(SECONDS_PER_SLIDE * 1000) * 100) + "%";
  };

  var _loadNextSlide = function () {
    _prepareNextSlide();
    $scope.slides[_currentSlideIndex].image = Math.random() * 10 % 2 < 1 ? 'http://lorempixel.com/530/300/' : 'http://lorempixel.com/530/300/people';
    $scope.slides[_currentSlideIndex].variants[0] = Math.random();
    $scope.slides[_currentSlideIndex].variants[1] = Math.random();
    $scope.slides[_currentSlideIndex].variants[2] = Math.random();
    $scope.slides[_currentSlideIndex].variants[3] = Math.random();
    $scope.$apply();
    //$scope.slides[_currentSlideIndex] = $scope.curentSlide;
    _currentSlideIndex++;
  };

  var _clearGameFields = function () {
    clearInterval(_intervalId);
    _currentSlideIndex = 0;
    _initProgressBar();
    //$scope.curentSlide = {};
  };

  var _endGame = function() {
    $ionicPopup.alert({
      title: 'Гра закінчена!',
      template: 'Результат '
    });
    $state.go('page1', {reload: false});
    _clearGameFields();
  };

  $scope.init = function () {
    $scope.curentSlide = _slideData;
    $scope.slides = [];
    _initProgressBar();
    _initTimer();
    _intervalId = setInterval(_updateTimer, TIMER_UPDATE_INTERVAL);
    _loadNextSlide();
  }
})


/************************************
 *
 *         LOGIN PAGE
 *
 ************************************
 */
.controller('loginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  if(AuthService.isAuthenticated()){
    $state.go('page1');
  }

  $scope.processingRequest = false;

  $scope.login = function(data) {
    if (data.username !== '' && data.password !== '') {
      $scope.processingRequest = true;
      AuthService.login(data.username, data.password)
      .then(function(authenticated) {
        $state.go('page1', {}, {reload: true, historyRoot: true});
        $scope.setCurrentUsername(data.username);
        $scope.processingRequest = false;
      }, function(errorMessage) {
        console.log(errorMessage);
        var alertPopup = $ionicPopup.alert({
          title: 'Упс!',
          template: errorMessage
        });
        $scope.processingRequest = false;
      });
    } else {
      //TODO add validation error message
    }
  };
});
