import {_remove} from 'lodash';

export default class UserController {

  constructor ($scope, $log, firebaseService, moment, toastr, user) {
    'ngInject';

    $scope.startDate = new Date();
    $scope.minStartDate = $scope.startDate;
    $scope.endDate = $scope.startDate;
    $scope.minEndDate = $scope.startDate;

    this.user = user;
    this.$scope = $scope;
    this.toastr = toastr;
    this.moment = moment;
    this.log = $log;
    this.firebaseService = firebaseService;
    this.vacations = [];
    this.activate($scope);

  }

  activate(scope) {
    scope.$watch('startDate', function() {
      scope.endDate = scope.startDate;
      scope.minEndDate = scope.startDate;
    });

  }

  submitHandler(startDate, endDate) {
    let vm = this;

    let toastrOptions = {progressBar: false};

    this.log.debug(this.vacations);

    if (this.$scope.userForm.$invalid) return;

    if (isCrossingIntervals(this.vacations)) {
      this.toastr.error('Пересечение интервалов', toastrOptions);
      return;
    }


    // list.push({
    //   startDate: startDate,
    //   endDate: endDate,
    //   status: 'inprogress',
    //   commentary: null
    // });

    // this.log.debug(this.user);
    // this.firebaseService.updateUserData(this.user);
    // this.firebaseService.createNewVacation({
    //   startDate: startDate,
    //   endDate: endDate,
    //   status: 'inprogress',
    //   commentary: null
    // });
    this.vacations.push({startDate, endDate});
    // this.$scope.$emit('vacationWasSent', {startDate, endDate});
    this.toastr.success('Заявка успешно отправлена!', toastrOptions);

    function isCrossingIntervals(dateIntervals) {

      if(dateIntervals.length === 0) return false;
      // console.log(vm.moment("2016-03-01").from(vm.moment("2016-03-04")));

      let test =  !!dateIntervals.filter(function(item) {

        // console.log(parseInt(vm.moment(startDate).from(vm.moment(startDate))

        if (vm.moment(startDate).from(vm.moment(startDate) && startDate <= item.endDate)) return true;
        // return endDate <= item.endDate;
      });

      return test;
    }
  }

  calcDays() {
    let result = this.moment(this.$scope.startDate).from(this.moment(this.$scope.endDate));

    if(result.indexOf('a day') >=0) {
      return result = 2;
    }
    if(!isNaN(parseInt(result))) {
      return parseInt(result) + 1;
    }
    return result = 1;

  }

  deleteVacation(item) {
    _remove(this.user.vacations.list,
      elem => item.id == elem.id);
  }

}
