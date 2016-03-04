export default function dropdownListDirective() {
  'ngInject';
  return {
    restrict: 'E',
    scope: {
      itemsList: '=',
      placeholder: '@',
      obj: '=',
      showEvents: '='
    },
    template:'<div class="form-group">'+
    '  <div class="dropdown" dropdown>'+
    '    <input class="form-control dropdown-toggle" dropdown-toggle id="statusinput" type="text" ng-model="search"/>'+
    '      <ul class="dropdown-menu dropdown-menu-right dropdown-scroll" role="menu">'+
    '        <li ng-repeat="item in itemsList | filter:search"><a ng-href="" role="menuitem" tabindex="-1" ng-click="chooseItem(item)">{{item.firstName}} {{item.lastName}}</a></li>'+
    '      </ul>'+
    '  </div>'+
    '</div>',

    link: function(scope){
      scope.chooseItem = function( item ){
        scope.search = item.firstName+' '+ item.lastName;
        scope.obj = item;
        var {firstName, lastName} = item;
        scope.showEvents = [];
        angular.forEach(item.vacations.list, function (value) {
          let {startDate, endDate, status} = value;
          let typeEvent = {rejected:'important',confirmed:'info', inprogress:'warning'};
          var event = 
          {
                        title: firstName +' '+ lastName, // The title of the event 
                        type: typeEvent[status], // The type of the event (determines its color). Can be important, warning, info, inverse, success or special 
                        startsAt: new Date(startDate), // A javascript date object for when the event starts 
                        endsAt: new Date(endDate), // Optional - a javascript date object for when the event ends 
                        editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable. If set to false will also prevent the event from being dragged and dropped. 
                        deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable 
                        incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view 
                        recursOn: 'year' // If set the event will recur on the given period. Valid values are year or month 
                      };
                      scope.showEvents.push(event);
                    });
      }
    }
  }
}
