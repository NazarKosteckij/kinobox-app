angular.module('app.services', [])

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
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
    username = token.split('.')[0];
    isAuthenticated = true;
    authToken = token;

    role = USER_ROLES.public;

    //TODO add access token
    // Set the token as header for your requests!
    //$http.defaults.headers.common['X-Auth-Token'] = token;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    //TODO add access token
    //$http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var login = function(name, password) {
    return $q(function(resolve, reject) {

      // request and receive auth token from server

      $http({
          method: 'POST',
          url: "https://kinobox.in.ua/api/login",
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
        .then(function(data){
          console.log(data.data);
          if(data.data.status === 'error'){
            reject('Login Failed.');
          } else
          if(data.data.status === 'success'){
            resolve('Login success.');
          }
        }, function(error){
          reject('Login Failed.');
          console.log(error.data)
        });

      storeUserCredentials(name + '.accessToken');
    });
  };

  var logout = function() {
    $http.get("https://kinobox.in.ua/api/logout").then(function(result) {
      console.log(result.data.status);
    });
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
