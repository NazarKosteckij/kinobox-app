angular.module('app.controllers')
  /************************************
   *
   *         GAME PAGE
   *
   ************************************
   */
  .controller('gameCtrl', function ($document, $ionicPopup, $ionicPlatform, $log, $scope, $state, GameService) {
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

    $scope.timeRemainPercents = {"width":_remainingTimeMs/(SECONDS_PER_SLIDE * 10) + "%"};

    $scope.submit = function () {
      if (_currentSlideIndex <= 10 && !$scope.slides[_currentSlideIndex - 1].submit  ) {
        $scope.slides[_currentSlideIndex - 1] = {
          // TODO temporary random! Delete it when game will be done!!!
          submit: true,
          correct: !(Math.random() + .5 | 0)
        };
        if (!_isEndOfGame()) {
          _loadNextSlide();
        } else {
          clearInterval(_intervalId);
          setTimeout(_endGame, 1000);
        }
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
          if (_isEndOfGame()){
            setTimeout(_endGame, 1000);
            clearInterval(_intervalId);
          } else {

            $scope.$apply( _loadNextSlide());
            console.log("Time limit reached");
          }
        }
      } else {
        setTimeout(_endGame, 1000);
        clearInterval(_intervalId);
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
      $scope.timeRemainPercents.width =  _remainingTimeMs/(SECONDS_PER_SLIDE * 10) + "%";
      document.getElementsByClassName("countdown-timer")[0].style = "width:" + $scope.timeRemainPercents.width;
      document.getElementsByClassName("countdown-timer")[1].style = "width:" + $scope.timeRemainPercents.width;

    };

    var _loadNextSlide = function () {
      _prepareNextSlide();
      $scope.slides[_currentSlideIndex].image = Math.random() * 10 % 2 < 1 ? 'https://lorempixel.com/530/300/' : 'https://lorempixel.com/530/300/people';
      $scope.slides[_currentSlideIndex].variants[0] = Math.random();
      $scope.slides[_currentSlideIndex].variants[1] = Math.random();
      $scope.slides[_currentSlideIndex].variants[2] = Math.random();
      $scope.slides[_currentSlideIndex].variants[3] = Math.random();
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
      _clearGameFields();
      $ionicPopup.alert({
        title: 'Гра закінчена!',
        template: 'Результат '
      });
      $state.go('main', {reload: false});
    };

    $scope.init = function () {
      document.getElementsByClassName("countdown-timer").async = true;
      $scope.curentSlide = _slideData;
      $scope.slides = [];
      _initProgressBar();
      _initTimer();
      _intervalId = setInterval(_updateTimer, TIMER_UPDATE_INTERVAL);
      _loadNextSlide();

    };
    $scope.init();
    $ionicPlatform.onHardwareBackButton(function () {
      _endGame();
    })
  })
