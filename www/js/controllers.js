angular.module('app.controllers', [])

.controller('appCtrl',function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();
  if(AuthService.isAuthenticated()){
    $state.go('page1', {reload: true});
  }

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
 *
 *         MAIN PAGE
 *
 ************************************
 */
.controller('page1Ctrl', function ( $scope, $state, $http, $ionicPopup, $ionicHistory, AuthService, ProfileService) {
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
.controller('gameCtrl', function ($document, $log, $scope, $state) {
  const SECONDS_PER_SLIDE = 5;
  const TIMER_UPDATE_INTERVAL = 10;

  var _slideData = {
    image: 'https://kinobox.in.ua/frames/53b7b6e261a04_1404548834.jpg',
    variants: ['asdfa', 'asdfa', 'asfdas', 'asdfasf'],
    submit: false,
    correct: false
  };
  var _remainingTimeMs = 0;
  var _intervalId = 0;

  var _initTimer = function() {
    _remainingTimeMs = SECONDS_PER_SLIDE * 1000;
  };

  var _updateTimer = function () {
    if (_remainingTimeMs > TIMER_UPDATE_INTERVAL) {
      _remainingTimeMs -= TIMER_UPDATE_INTERVAL;
      _render();
      console.log(_remainingTimeMs/1000);
    } else {
      //TODO stop the timer
      console.log("Time limit reached");
    }
  };

  (function () {
    $scope.curentSlide = _slideData;
    $scope.curentSlideNumber = 1;
    $scope.slides = [];

    _initTimer();
    _intervalId = setInterval(_updateTimer, TIMER_UPDATE_INTERVAL);

    for (var i = 0; i < 10; i++) {
      $scope.slides[i] = _slideData;
    }
  })();

  $scope.submit = function () {
    $scope.slides[$scope.curentSlideNumber - 1] = {
      // TODO temporary random! Delete it when game will be done!!!
      submit: true,
      correct: !(Math.random() + .5|0)
    };
    _prepareNextSlide();
    $scope.curentSlideNumber++;
  };

  var _prepareNextSlide = function () {
    if (!_isEndOfGame()) {
      _initTimer();
      $scope.slideData = $scope.slides[$scope.curentSlideNumber - 1];
    } else {
      _endGame();
      //TODO add popup with result of the game
      $state.go('page1', {reload: false});
    }
  };

  var _isEndOfGame = function () {
    return $scope.curentSlideNumber >= 10;
  };
  var _percentage = 100;
  var _render = function() {
    console.log( $document.find(".countdown-timer"));
    document.getElementsByClassName("countdown-timer")[0].style = "width:" + (_remainingTimeMs/(SECONDS_PER_SLIDE * 1000) * 100) + "%";
  };

  var _loadNextSlide = function () {

  };

  var _endGame = function() {
    clearInterval(_intervalId);
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
