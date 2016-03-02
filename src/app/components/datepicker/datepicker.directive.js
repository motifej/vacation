export default function DatepickerDirective() {
    'ngInject';

    let directive = {
        scope: {
            curDate: '=ngModel',
            minDate: '='
        },
        restrict: 'E',
        link: link,
        templateUrl: 'app/components/datepicker/datepicker.html'
    };

    return directive;

    function link(scope, element, attrs) {
        scope.name = attrs.name;

        scope.maxDate = new Date(2020, 5, 22);

        scope.open= function() {
            scope.popup.opened = true;
        };

        scope.setDate = function(year, month, day) {
            scope.curDate = new Date(year, month, day);
        };

        scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };


        scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        scope.format = scope.formats[0];
        scope.altInputFormats = ['M!/d!/yyyy'];

        scope.popup = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        scope.events =
        [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
        ];

        scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < scope.events.length; i++) {
                    var currentDay = new Date(scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return scope.events[i].status;
                    }
                }
            }

            return '';
        };
    }
}
