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
    this.activate($scope);

  }

  activate(scope) {

    scope.$watch('startDate', function() {
      if (scope.endDate <= scope.startDate) scope.endDate = scope.startDate;
      scope.minEndDate = scope.startDate;
    });

  }

  submitHandler(startDate, endDate) {
    this.log.info(this.user);

    let vm = this;
    let sDate = new Date(startDate).getTime();
    let eDate = new Date(endDate).getTime();
    let toastrOptions = {progressBar: false};
    let vacation;
    let list = this.user.vacations.list;
    vm.vacations = [];

    if (list) {
      for (let item in list) {
        if (list[item].status === 'rejected') continue;
        vm.vacations.push({startDate: list[item].startDate, endDate: list[item].endDate, status: list[item].status, commentary: list[item].commentary});
      }
    }

    if (this.$scope.userForm.$invalid) return;

    if (list && isCrossingIntervals(vm.vacations)) {
      this.toastr.error('Промежутки отпусков совпадают c предыдущими заявками!', toastrOptions);
      return;
    }

    vacation = {
      startDate: sDate,
      endDate: eDate,
      status: 'inprogress',
      commentary: null
    };

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
    return this.moment().isoWeekdayCalc(this.$scope.startDate, this.$scope.endDate, [1,2,3,4,5]);
  }

  deleteVacation(item) {
    this.firebaseService.removeVacation(item.id);
  }
}
