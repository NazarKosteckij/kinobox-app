/**
 * Created by Назар on 14.04.2016.
 */
angular.module('app.services')

  .service('PluralizationService', function() {
    var _pluralise = function (number, singleForm, pluralForm2, pluralForm5) {
      number = Math.abs(number) % 100;
      $n1 = number % 10;
      if (number > 10 && number < 20) return pluralForm5;
      if ($n1 > 1 && $n1 < 5) return pluralForm2;
      if ($n1 == 1) return singleForm;
      return pluralForm5;
    };

    return {
      pluralize : _pluralise
    }
  });
