angular.module('app.directives', [])

.directive('blankDirective', [function(){

}])
  .directive('keyFocus', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        elem.bind('keyup', function (e) {
          // up arrow
          if (e.keyCode == 38) {
            if(!scope.$first) {
              elem[0].previousElementSibling.focus();
            }
          }
          // down arrow
          else if (e.keyCode == 40) {
            if(!scope.$last) {
              elem[0].nextElementSibling.focus();
            }
          }
        });
      }
    };
  });

