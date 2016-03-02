import {_remove} from 'lodash';

export default class UserController {
  constructor (toastr, $modal, firebaseService) {
    'ngInject';

    this.firebaseService = firebaseService;
    this.modal = $modal;
    this.userData = {};
    this.activate();
  }

  activate() {
    this.userData = this.firebaseService.getUserData();
  }

  deleteVacation(item) {
    _remove(this.data.vacations.list, function(elem) {
      return item.id == elem.id;
    });
  }

  openNewUserForm() {
    this.modal.open({
      templateUrl: '../app/components/manager/newUserForm.html',
      controller: 'AddNewUserController',
      controllerAs: 'user',
      resolve: {
        items: function () {
          return this;
        }
      }
    });
  }

}
