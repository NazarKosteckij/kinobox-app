angular.module('app.controllers')

/************************************
 *
 *         LOGIN PAGE
 *
 ************************************
 */
.controller('loginCtrl', function ($scope, $state, $ionicPopup, AuthService, $http) {
  var _checkVersion = function () {
    console.log("Checking for updates");
    const host =
      //"192.168.1.5";
      "nazar.webhop.me";

    $http.get("http://" + host + "/kinobox-app/nightly/version.php", {dataType: "json"})
      .then(
        function (data) {
          console.log(data);
          if (data.data) {
            data.data = JSON.parse(data.data);
            if (data.data.version !== "0.8.3a") {

              if (data.data.apk) {
                $ionicPopup.confirm({
                  title: 'Оновлення',
                  template: 'Доступна нова тестова версія додатку. Хочете завантажити її? <a href="' + data.data.apk + '"> Скачати </a>',

                }).then(function (res) {
                  if (res) {
                    window.location = data.data.apk;
                    ionic.Platform.exitApp();

                  } else {
                    ionic.Platform.exitApp();
                  }
                });

              } else {
                $ionicPopup.alert({
                  title: 'Упс!',
                  template: "Ви використовували тестову версію додатку. Ми припинили підтримку цієї версії",
                  onTap: function () {
                    ionic.Platform.exitApp();
                  }
                });
              }
            }
          }
        }, function (data) {
          console.log(data);
          console.log('exiting');
          ionic.Platform.exitApp();
        });
  };

  _checkVersion();

  if(AuthService.isAuthenticated()){
    //TODO add checking for bonus
    $state.go('main');
  }

  $scope.processingRequest = false;

  $scope.login = function(data) {
    _checkVersion();
    if (data.username !== '' && data.password !== '') {
      $scope.processingRequest = true;
      AuthService.login(data.username, data.password)
        .then(function(authenticated) {
          $state.go('main', {}, {reload: true, historyRoot: true});
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
})

