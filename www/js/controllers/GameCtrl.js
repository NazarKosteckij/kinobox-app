angular.module('app.controllers')
  /************************************
   *
   *         GAME PAGE
   *
   ************************************
   */
  .controller('gameCtrl', function ($document, $ionicPopup, $ionicPlatform, $log, $scope, $state, GameService) {

    // TIMER logic

    const SECONDS_PER_SLIDE = 15;
    const TIMER_UPDATE_INTERVAL = 10;
    var _remainingTimeMs = 0;
    var _intervalId = 0;

    $scope.timeRemainPercents = {"width":_remainingTimeMs/(SECONDS_PER_SLIDE * 10) + "%"};

    /**
     * Resets countdown timer to SECONDS_PER_SLIDE seconds.
     *
     * @private
     */
    var _resetTimer = function() {
      _remainingTimeMs = SECONDS_PER_SLIDE * 1000;
    };

    var _updateTimer = function () {
        if (_remainingTimeMs > TIMER_UPDATE_INTERVAL) {
          _remainingTimeMs -= TIMER_UPDATE_INTERVAL;
          _renderTimer();
        } else {
          _loadNextSlide();
          console.log("Time limit reached");
        }
    };

    // The Game logic

    $scope.slides = [];

    var _variant = {
      id: 1,
      title_ua: "\u0421\u0430\u043c\u043e\u0437\u0432\u0430\u043d\u0435\u0446\u044c",
      title_ru: "\u0421\u0430\u043c\u043e\u0437\u0432\u0430\u043d\u0435\u0446",
      title_en: "The Imposter",
      year: 2012
    };

    var _slideData = {
      options : [],
      frames : [
        {"image":"53ac04b45fd0e_1403782324.jpg"},
        {"image":"53ac04b479d37_1403782324.jpg"}
      ],
      "game_value_id" : ""
    };

    var _currentSlideNumber = 0;


    $scope.submit = function (id) {
       //TODO add checking
      $scope.progress[_currentSlideNumber - 1].submit = true;

      $scope.progress[_currentSlideNumber - 1].correct = _currentSlideNumber%2===1;

      _loadNextSlide();

    };


    /**
     *
     * @returns {boolean} true when count of slides more than 10
     * @private
     */
    var _isEndOfGame = function () {
      return _currentSlideNumber >= 10;
    };

    var _renderTimer = function() {
      $scope.timeRemainPercents.width =  _remainingTimeMs/(SECONDS_PER_SLIDE * 10) + "%";
      document.getElementsByClassName("countdown-timer")[0].style = "width:" + $scope.timeRemainPercents.width;
      document.getElementsByClassName("countdown-timer")[1].style = "width:" + $scope.timeRemainPercents.width;
    };

    var _loadNextSlide = function () {
      if (!_isEndOfGame()) {
        _currentSlideNumber++;
        _resetTimer();
        GameService.loadSlide(_currentSlideNumber).then(
          function(data) {
            $scope.slides.push(data);
            console.log(data);
          },
          function(data) {
            $ionicPopup.alert({
              title: 'Упс',
              template: 'Сталася помилка '
            });
            _endGame(true);
          });

      } else {
        _endGame();
      }
    };

    var _clearGameFields = function () {
      clearInterval(_intervalId);
      _currentSlideNumber = 0;
      _initProgressBar();
    };

    var _endGame = function(error) {
      _clearGameFields();
      if (!error) {
        $ionicPopup.alert({
          title: 'Гру закінчено!',
          template: 'Результат '
        });
      }
      $state.go('main', {reload: false});
    };

    // Progress Bar
    $scope.progress = [];
    var _progress = {submit: false, correct: false}

    var _initProgressBar = function () {
      for (var i = 0; i < 10; i++) {
        $scope.progress.push(angular.copy(_progress));
      }
    };

    $scope.init = function () {
      _initProgressBar();
      _resetTimer();
      _intervalId = setInterval(_updateTimer, TIMER_UPDATE_INTERVAL);
      _loadNextSlide();
    };

    $scope.getCurrentSlide = function () {
      return $scope.slides[_currentSlideNumber - 1];
    };

    $scope.init();

    $ionicPlatform.onHardwareBackButton(function () {
      _endGame();
    })
  })