/**
 * Created by Назар on 01.04.2016.
 */
angular.module('app.services')

.service('translationService', function($resource) {
  var language = window.localStorage['language'];

  this.getSelectedLanguage = function () {
    return language;
  };

  this.getTranslation = function($scope) {
    language = window.localStorage['language'];

    if (language !== 'ru' && language !== 'uk') {
      language ='uk';
      window.localStorage['language'] = language;
    }
    var languageFilePath = 'localization/lang_' + language + '.json';
    console.log(languageFilePath);
    $resource(languageFilePath).get(function (data) {
      $scope.translation = data;
    });
  };

});
