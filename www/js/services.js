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
