/**
 * Created by Назар on 01.04.2016.
 */
angular.module('app.services')

.service('translationService', function($resource) {
  this.getTranslation = function($scope) {
    var language = window.localStorage['language'];

    if (language !== 'ru' && language !== 'uk') {
      language ='uk';
    }

    var languageFilePath = 'localization/lang_' + language + '.json';
    console.log(languageFilePath);
    $resource(languageFilePath).get(function (data) {
      $scope.translation = data;
    });
  };

});
