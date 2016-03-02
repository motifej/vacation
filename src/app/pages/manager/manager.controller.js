 import { find } from 'lodash';
 import * as status from '../../constants/status.consts';
 import { groups } from '../../constants/groups.consts';

export default class ManagerController {
  constructor ($scope, $timeout, firebaseService, userList) {
    'ngInject';

    this.firebaseService = firebaseService;
    this.users = userList;
    this.groups = groups;
    this.filter;
    this.statusFilter = { status: "" };

  }

    confirmVacation(user, id) {
     find(user.vacations.list, { id: id }).status = status.CONFIRMED;
      this.firebaseService.updateUserData(user);
    }
    rejectVacation(user, id) {
     find(user.vacations.list, { id: id }).status = status.REJECTED;
      this.firebaseService.updateUserData(user);
    }

} 
