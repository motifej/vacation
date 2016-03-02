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
    this.statusFilter = { status: "inprogress" };
    this.buttonFilter = 'inprogress';

  }

    confirmVacation(user, id) {
     find(user.vacations.list, { id: id }).status = status.CONFIRMED;
      this.firebaseService.updateUserData(user);
    }
    rejectVacation(user, id) {
     find(user.vacations.list, { id: id }).status = status.REJECTED;
      this.firebaseService.updateUserData(user);
    }
    choiceGroup(group) {
      this.filter = {};
      this.filter = { group: group };
    }
    choiceUser(user) {
      this.filter = {};
      this.filter = { uid: user };
    }
    choiceButtonFilter(filter) {
      this.buttonFilter = filter;
      this.statusFilter.status = filter;
    }

} 
