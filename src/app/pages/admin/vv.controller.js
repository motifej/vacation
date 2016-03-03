export default class VvController {
  constructor (firebaseService) {
    'ngInject';

    this.oneThing = [];
    this.awesomeThings = [];
    this.userName = [];
    this.events = [];
    this.newEvent = {};
    this.selected = "sds";
    this.classAnimation = '';
    this.calendarView = 'month';
    this.activate(firebaseService);
    this.calendarDay = new Date();
    this.newEvent.startsAt = new Date(); 
    this.newEvent.endsAt = new Date();
  }

  setDateInfo() {
    var _this = this;

    _this.events = [];
    angular.forEach(this.awesomeThings, function(value){

      var startDateBase = _this.truncateTime(value.vacations.list[0].startDate);
      var startDateCalendar = _this.truncateTime(_this.newEvent.startsAt);
      var endDateBase = _this.truncateTime(value.vacations.list[0].endDate);
      var endDateCalendar = _this.truncateTime(_this.newEvent.endsAt);
    
      if ( !('vacations' in value) ) {
        return
      }else 
      {
        if((startDateBase <= endDateCalendar && endDateBase >= startDateCalendar) ||
           (endDateBase >= startDateCalendar && startDateBase <= endDateCalendar))  {

          var events = 
            {
              title: value.firstName + ' '+ value.lastName, // The title of the event 
              type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special 
              startsAt: new Date(value.vacations.list[0].startDate), // A javascript date object for when the event starts 
              endsAt: new Date(value.vacations.list[0].endDate), // Optional - a javascript date object for when the event ends 
              editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable. If set to false will also prevent the event from being dragged and dropped. 
              deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable 
              incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view 
              recursOn: 'year' // If set the event will recur on the given period. Valid values are year or month 
            }
            _this.events.push(events);
          }
        }
      });
  }

  activate(firebaseService) {
    var _this = this;
    firebaseService.getUsersList().then( d => {
      _this.awesomeThings = d;
      _this.oneThing = d[0];
    });
  }

  truncateTime(dateValue) {
    var dateValue = new Date(dateValue);
    var dayValue = dateValue.getDate();
    var monthValue = dateValue.getMonth();
    var yearValue = dateValue.getFullYear();
    return new Date(yearValue,monthValue,dayValue);
  }

}
