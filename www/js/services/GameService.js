angular.module('app.services')

  .service('GameService', function($q, $http) {
  const _time = {
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  const _gameStatus = {
    allowed: false,
    timeToStart: _time
  };

  var _convertToTime = function (secondsRemain) {
    var time = _time;

    const denominatorSec = 1;
    const denominatorMin = 60 * denominatorSec;
    const denominatorH = 60 * denominatorMin;

    var hours = _integerDivision(secondsRemain, denominatorH);
    var minutes = _integerDivision(secondsRemain - hours * denominatorH, denominatorMin);
    var seconds = _integerDivision(secondsRemain - hours * denominatorH - minutes * denominatorMin, denominatorSec);

    time.hours = hours;
    time.minutes = minutes;
    time.seconds = seconds;

    return time;
  };

  var _integerDivision = function(x, y) {
    return x/y>>0
  };

  var _isGameAllowed = function(){
    return $q(function(resolve, reject) {
      $http.get("https://kinobox.in.ua/api/startGame").then(function(response){
        var startGame = _gameStatus;
        startGame.allowed = response.data.status === "active";
        startGame.timeToStart = startGame.allowed ? 0 : _convertToTime(response.data.data.remain);
        startGame.timeToStart === 0 ? delete startGame.timeToStart : null ;
        resolve(startGame);
      }, function(err) {
        reject(err);
      });
    })
  };



  return {
    isGameAllowed: _isGameAllowed
  }
});
