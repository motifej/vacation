import {_remove} from 'lodash';

export default class UserController {
  constructor ($scope, $log, firebaseService, moment, user) {
    'ngInject';
    $scope.startDate = new Date();
    $scope.minStartDate = new Date();
    $scope.endDate = $scope.startDate;
    $scope.minEndDate = $scope.startDate;
    $scope.$watch('startDate', function() {
      $scope.endDate = $scope.startDate;
      $scope.minEndDate = $scope.startDate;
    });
    $scope.calcDays = function() {
      let result = moment($scope.startDate).from(moment($scope.endDate));

      if(result.indexOf('a day') >=0) {
        return result = 2;
      }
      if(!isNaN(parseInt(result))) {
        return parseInt(result) + 1;
      }
      return result = 1;

    };

    this.user = user;
    this.log = $log;
    this.firebaseService = firebaseService;
    this.submitHandler = function (startDate, endDate) {
      if ($scope.userForm.$invalid) return;
      let list = this.user.vacations.list;
      list.push({
        id: list.length + 1,
        startDate: startDate,
        endDate: endDate,
        status: null,
        commentary: null
      });
      $log.debug(this.user);
      firebaseService.updateUserData(this.user);
      $scope.$emit('vacationWasSent', {startDate: startDate, endDate: endDate});
    }
    // $scope.$on('vacationWasSent', (event, dates) => console.log(dates));
  }

  deleteVacation(item) {
    _remove(this.user.vacations.list,
      elem => item.id == elem.id);
  }

}
