angular.module('app.services', [])

  .service('ProfileService', function($q, $http, AuthService) {
  var _user = {
    name : '',
    balance : 0,
    avatar: {
      small : null,
      medium : null
    }
  };


  var _loadUser = function () {
    if(AuthService.isAuthenticated()) {
      $http({
        method: 'GET',
        url:"https://kinobox.in.ua/api/getUserData"
      }).then(function(response){
        setCurrentUserFields(response.data.data);
        console.log(_user);
      })
    } else {

    }
  };


  var setCurrentUserFields = function (userData) {
    _user.avatar.medium = userData.img_profile_100;
    _user.avatar.small = userData.img_profile_70;
    _user.balance = userData.balance;
    _user.name = userData.username;

    console.log(_user);
  };

  return {
    user: _user,
    loadUser: _loadUser
  }
})
