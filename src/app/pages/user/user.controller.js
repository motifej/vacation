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
      if (scope.endDate <= scope.startDate) scope.endDate = scope.startDate;
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

    this.firebaseService.createNewVacation({
      startDate: startDate,
      endDate: endDate,
      status: 'inprogress',
      commentary: null
    });
    this.vacations.push({startDate, endDate});
    this.toastr.success('Заявка успешно отправлена!', toastrOptions);

    function isCrossingIntervals(dateIntervals) {

      if(dateIntervals.length === 0) return false;

      let arr = dateIntervals.filter(function(item) {
        return (vm.moment(startDate).diff(vm.moment(item.startDate)) >= 0
              && vm.moment(item.endDate).diff(vm.moment(startDate)) >= 0
              || vm.moment(item.startDate).diff(vm.moment(endDate)) <= 0
              && vm.moment(item.endDate).diff(vm.moment(endDate)) >= 0);
      });

      return arr.length !== 0;
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
