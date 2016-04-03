angular.module('app.controllers')
  /************************************
   *
   *         GAME PAGE
   *
   ************************************
   */
  .controller('gameCtrl',
    function ($document, $ionicPopup, $ionicHistory, $ionicPlatform, $ionicLoading, $log, $scope, $state,
              GameService, translationService) {

      $scope.translate = function(){
        translationService.getTranslation($scope, $scope.selectedLanguage);
      };

      $scope.translate();

    // TIMER logic
    const SECONDS_PER_SLIDE = 15;
    const TIMER_UPDATE_INTERVAL = 10;
    var _remainingTimeMs = 0;
    var _intervalId = 0;
    var _inputLocked = false;
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
          if(!_inputLocked) {
            _remainingTimeMs -= TIMER_UPDATE_INTERVAL;
          }
          $scope.$applyAsync(_renderTimer);
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
      if(_inputLocked) {
        return;
      }
      const SLIDE_ID = id;
      _checkAnswer(id).then(function (data) {
        console.log(data);
        $scope.progress[_currentSlideNumber - 1].submit = true;
        $scope.progress[_currentSlideNumber - 1].correct = ! (data.data.answer === 'wrong') ;

        $scope.slides[_currentSlideNumber - 1].options.forEach(function (option) {

          //Commented because we don't show correct answer if user didn't check it
          /*
          if (md5(option.id + 'kinobox') === $scope.slides[_currentSlideNumber - 1].game_value_id) {
            option.submit = true;
            option.correct = true;
          }
          */

          if (option.id === SLIDE_ID) {
            option.submit = true;
            option.correct = ! (data.data.answer === 'wrong') ;

          }
        });

        //Delay to see results
        _loadNextSlide();

      });
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
     if(!_inputLocked)
      if (!_isEndOfGame()) {
        $ionicLoading.show({
          template:"Завантаження..."
        });
        _inputLocked = true;
        GameService.loadSlide(_currentSlideNumber + 1).then(
          function (data) {
            var img = new Image();
            img.src = "https://kinobox.in.ua/frames/" + data.frames[0].image;
            img.onload = function () {
              $scope.slides.push(data);
              console.log("Слайд завантажено");
              _inputLocked = false;
              _resetTimer();
              _currentSlideNumber++;
              $ionicLoading.hide();
            };
            console.log("Отримано дані слайду");
            console.log(data);
          },
          function(data) {
            $ionicPopup.alert({
              title: 'Упс',
              template:
              data.errorStatus !== "internal error" ?
                data.message === 'completed' ? 'Сталася помилка. Ви нещодавно закінчили гру!' : 'Сталася помилка.' :
                'Немає зв\'язку із сервером.'
            });

            console.log("Помилка завантаження слайду");
            console.log(data);
            _endGame(true);
          });

      } else {
        _endGame();
      }
    };

    var _checkAnswer = function(answerId){
      return GameService.checkAnswer(_currentSlideNumber, answerId);
    };

    var _clearGameFields = function () {
      clearInterval(_intervalId);
      _currentSlideNumber = 0;
      _initProgressBar();
    };

    var _endGame = function(error) {
      $ionicLoading.hide();
      var result = 0;
      $scope.progress.forEach(function(progress) {
        if (progress.submit && progress.correct) {
          result++;
        }
      });


      if (error) {
        GameService.finishGame({finish_type: 'reset'});
      } else {
        GameService.finishGame({
          next: !$scope.sckipButtonAllovew,
          half: !$scope.shift2IncorrectOptionsAllowed,
          another_frame: !$scope.oneMoreImageAllovew
        });
        console.log("Гру закінчено");
      }

      setTimeout(function () {
        _clearGameFields();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });

        $state.go('results', { result : result });
      }, 1000);
    };

    // Progress Bar
    $scope.progress = [];
    var _progress = {submit: false, correct: false}

    var _initProgressBar = function () {
      $scope.progress = [];
      for (var i = 0; i < 10; i++) {
        $scope.progress.push(angular.copy(_progress));
      }
    };

    // Help buttons

    $scope.sckipButtonAllovew = true;
    $scope.skipBtn = function () {
      $scope.sckipButtonAllovew = false;
      _loadNextSlide();
    };

    $scope.sckipButtonAllovew = true;
    $scope.skipBtn = function () {
      $scope.sckipButtonAllovew = false;
      _loadNextSlide();
    };

    $scope.oneMoreImageAllovew = true;

    $scope.getOneMoreImage = function () {
      var slide = $scope.getCurrentSlide();
      slide.frames[0] = slide.frames[1];
      $scope.oneMoreImageAllovew = false;
    };


    $scope.shift2IncorrectOptionsAllowed = true;

    $scope.shift2IncorrectOptions = function () {
      var slide = $scope.getCurrentSlide();
      $scope.shift2IncorrectOptionsAllowed = false;
      for (var i = 0; i < 4; i++) {
        if (md5(slide.options[i].id + 'kinobox') !== slide.game_value_id) {
          slide.options.splice(i,1);
        }
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
