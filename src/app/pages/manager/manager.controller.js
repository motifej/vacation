 import { find } from 'lodash';
 import * as status from '../../constants/status.consts';
 import { groups } from '../../constants/groups.consts';
 import AddNewUserController from './addNewUser.controller'

export default class ManagerController {
  constructor ($scope, $timeout, firebaseService, userList, $modal, moment) {
    'ngInject';

    this.firebaseService = firebaseService;
    this.users = userList/*.map(user => {
      user.vacations.list = user.vacations.list.filter(item => item.startDate && item.endDate);
      return user;
    })*/;
    this.groups = groups;
    this.filter = {};
    this.statusFilter = { status: "inprogress" };
    this.modal = $modal;

  }

    confirmVacation(user, id) {
     var vacation = find(user.vacations.list, { id: id });
     vacation.status = status.CONFIRMED;
     user.vacations.total -= moment().isoWeekdayCalc(vacation.startDate,vacation.endDate,[1,2,3,4,5]);
     console.log(moment().isoWeekdayCalc(vacation.startDate,vacation.endDate,[1,2,3,4,5]));
      this.firebaseService.updateUserData(user);
    }
    rejectVacation(user, id) {
     find(user.vacations.list, { id: id }).status = status.REJECTED;
      this.firebaseService.updateUserData(user);
    }
    choiceGroup(group) {
      this.filter = { group: group };
    }
    choiceUser(user) {
      this.filter = { uid: user };
    }
    choiceButtonFilter(filter) {
      this.statusFilter.status = filter;
    }
    openNewUserForm() {
    this.modal.open({
      templateUrl: '../app/pages/manager/newUserForm.html',
      controller: AddNewUserController,
      controllerAs: 'user'
    });
  }

} 
