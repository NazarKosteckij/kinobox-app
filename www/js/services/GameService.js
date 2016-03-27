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


    var _loadSlide = function(frameNumber){
      console.log
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: "https://kinobox.in.ua/api/game" ,
          data: {game_relay: frameNumber},
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },

          transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          }
        })
          .then(function(response){
            console.log(response);
              response.data.status === "success" ?  resolve(response.data.data) : reject(response.data.data);
            },
            function(error){
              console.log(error);
              reject(error);
            });
      });
    };


    return {
      isGameAllowed: _isGameAllowed,
      loadSlide: _loadSlide

    }
});
