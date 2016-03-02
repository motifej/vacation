 import { find } from 'lodash';
 import * as status from '../../constants/status.consts';
 import { groups } from '../../constants/groups.consts';

export default class ManagerController {
  constructor ($scope, $timeout, firebaseService, userList, $filter) {
    'ngInject';

    this.firebaseService = firebaseService;
    this.users = userList.map(user => {
      user.vacations.list = user.vacations.list.filter(item => item.startDate && item.endDate);
      return user;
    });
    this.groups = groups;
    this.filter = {};
    this.statusFilter = { status: "inprogress" };
    this.invalidForm = false;
    this.namePattern = '[a-zA-Zа-яА-Я]+';
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.filterPhone = $filter;
    this.toastr = toastr;
    this.modalInstance = $modalInstance;

    this.newUser = {
      firstName: '',
      lastName: '',
      role: '',
      group: '',
      phone: '',
      email: '',
      uid: '',
      vacations: {
        total: null,
        dayOff: null,
        list: [{
          id: null,
          startDate: '',
          endDate: '',
          status: '',
          comments: ''
        }]
      }
    }


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
      this.filter = { group: group };
    }
    choiceUser(user) {
      this.filter = { uid: user };
    }
    choiceButtonFilter(filter) {
      this.statusFilter.status = filter;
    }

    submitForm (isValid) {
    if (isValid) {
      this.invalidForm = false;
      this.modalInstance.close();
      this.toastr.success('New user is added', 'Success');
      // push newUser to your array of USERS!
    } else {
      this.toastr.error('Not all fields are filled', 'Error');
      this.invalidForm = true;
    };
  };

  phoneChanged() {
   this.newUser.phone = this.filterPhone('phoneFilter')(this.newUser.phone);
  }

  cancelNewUser() {
    this.modalInstance.dismiss('cancel');
  }


} 
