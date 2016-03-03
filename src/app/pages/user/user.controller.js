//TODO Сделать дату в ISO формате

import {_remove} from 'lodash';

export default class UserController {

  constructor ($scope, $log, firebaseService, moment, toastr, user) {
    'ngInject';

    $scope.startDate = new Date();
    $scope.minStartDate = $scope.startDate;
    $scope.endDate = $scope.startDate;
    $scope.minEndDate = $scope.startDate;

    this.user = user;
    this.vacationsHistory = [];
    this.$scope = $scope;
    this.toastr = toastr;
    this.moment = moment;
    this.log = $log;
    this.firebaseService = firebaseService;
    this.activate($scope);

  }

  activate(scope) {

    let list = this.user.vacations.list;

    if (list) {
      for (let item in list) {
      this.vacationsHistory.push({startDate: list[item].startDate, endDate: list[item].endDate, status: list[item].status, commentary: list[item].commentary});
      }
    }

    scope.$watch('startDate', function() {
      if (scope.endDate <= scope.startDate) scope.endDate = scope.startDate;
      scope.minEndDate = scope.startDate;
    });

  }

  submitHandler(startDate, endDate) {

    let sDate = new Date(startDate).getTime();
    let eDate = new Date(endDate).getTime();
    let vm = this;
    let toastrOptions = {progressBar: false};
    let vacation;

    if (this.$scope.userForm.$invalid) return;

    if (isCrossingIntervals(vm.vacationsHistory)) {
      this.toastr.error('Промежутки отпусков совпадают c предыдущими заявками!', toastrOptions);
      return;
    }

    vacation = {
      startDate: sDate,
      endDate: eDate,
      status: 'inprogress',
      commentary: null
    };

    this.vacationsHistory.push(vacation);
    this.firebaseService.createNewVacation(vacation);

    this.toastr.success('Заявка успешно отправлена!', toastrOptions);

    function isCrossingIntervals(dateIntervals) {
      if(dateIntervals.length === 0) return false;

      let result = dateIntervals.filter(function(item) {
        if  (vm.moment(sDate).diff(vm.moment(item.startDate)) >= 0
              && vm.moment(item.endDate).diff(vm.moment(sDate)) >= 0
              || vm.moment(item.startDate).diff(vm.moment(eDate)) <= 0
              && vm.moment(item.endDate).diff(vm.moment(eDate)) >= 0) {
          return true;
        }
      });
      return result.length !== 0;
    }
  }

  calcDays() {
    let result = this.moment(this.$scope.endDate).diff(this.moment(this.$scope.startDate));
    return new Date(result).getDate();
  }

  deleteVacation(item) {
    _remove(this.user.vacations.list,
      elem => item.id == elem.id);
  }

}
