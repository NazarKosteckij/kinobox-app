angular.module('app.services', [])

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    request: function (request) {

      console.log(request);
      return request;
    },
    response: function (response){
      console.log(response);
      return response;
    },

    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

.service('AuthService', function($q, $http, USER_ROLES) {
  var LOCAL_TOKEN_KEY = 'tTokenKey';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);

      //$http.get("https://kinobox.in.ua/api/logout").then(function(result) {
      //  username = result.data.data.username;
      //});
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    role = USER_ROLES.public;

    // Set the token as header for your requests!
    $http.defaults.headers.common['X-Auth-Token'] = token;
  }

  function destroyUserCredentials() {
    authToken = null;
    username = '';
    isAuthenticated = false;
    //TODO add access token
    $http.defaults.headers.common['X-Auth-Token'] = null;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var login = function(name, password) {
    return $q(function(resolve, reject) {

      // request and receive auth token from server

      $http({
          method: 'POST',
          url: "https://kinobox.in.ua/api/access_token",
          data:  {
            username: name,
            password: password
          },

          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },

          transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
            }
          })
        .then(function(respose){
          console.log(respose.data);
          if(respose.data.status === 'error'){
            reject('Перевірте правельність вводу.');
          } else
          if(respose.data.status === 'success' || respose.data.status === 'already_logged'){
            resolve('Вхід виконано.');
            storeUserCredentials(respose.data.data.access_token);
            console.log(respose.data);
          }
        }, function(error){
          reject('Немає зв\'язку із сервером.');
          console.log(error.data)
        });


    });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
})

.service('ProfileService', function($q, $http, AuthService) {
  var user = {
    name : '',
    balance : 0,
    avatar: {
      small : null,
      medium : null
    }
  };


  var loadUser = function () {
    if(AuthService.isAuthenticated()) {
      $http({
        method: 'GET',
        url:"https://kinobox.in.ua/api/getUserData"
      }).then(function(response){
        setCurrentUserFields(response.data.data);
        console.log(user);
      })
    } else {

    }
  };


  var setCurrentUserFields = function (userData) {
    user.avatar.medium = userData.img_profile_100;
    user.avatar.small = userData.img_profile_70;
    user.balance = userData.balance;
    user.name = userData.username;

    console.log(user);
  };

  return {
    user: user,
    loadUser: loadUser
  }
})
