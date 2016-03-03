export default class VvController {
  constructor (firebaseService, userList) {
    'ngInject';
    let today = new Date();
    today = today.setHours(0,0,0,0);
    this.oneThing = userList[0];
    this.awesomeThings = userList;
    this.userName = [];
    this.events = [];
    this.newEvent = {};
    this.selected = "sds";
    this.calendarView = 'month';
    this.calendarDay = new Date(today);
    this.newEvent.startsAt = new Date(today); 
    this.newEvent.endsAt = new Date(today);
  }

  setDateInfo() {
    let events = this.events;
    let { startsAt, endsAt} = this.newEvent;

    angular.forEach(this.awesomeThings, function (value) {
      if ( 'vacations' in value ) {
        let {startDate, endDate} = value.vacations.list[0];
        if((startDate <= endsAt && endDate >= startsAt) ||
           (endDate >= startsAt && startDate <= endsAt))  {

          var event = 
            {
              title: value.firstName + ' '+ value.lastName, // The title of the event 
              type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special 
              startsAt: new Date(startDate), // A javascript date object for when the event starts 
              endsAt: new Date(endDate), // Optional - a javascript date object for when the event ends 
              editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable. If set to false will also prevent the event from being dragged and dropped. 
              deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable 
              incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view 
              recursOn: 'year' // If set the event will recur on the given period. Valid values are year or month 
            };
          events.push(event);
        }
      }
    });
  }

}
