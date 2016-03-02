import { groups } from '../../constants/groups.consts';
import * as roles from '../../constants/groups.consts';
export default class AddNewUserController {
  constructor ($filter, $modal, $modalInstance, toastr) {
    'ngInject';

    this.invalidForm = false;
    this.namePattern = '[a-zA-Zа-яА-Я]+';
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.filter = $filter;
    this.toastr = toastr;
    this.modalInstance = $modalInstance;
    this.group = groups;
    this.role = roles;

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

  activate() {};

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
   this.newUser.phone = this.filter('phoneFilter')(this.newUser.phone);
  }

  cancelNewUser() {
  	this.modalInstance.dismiss('cancel');
  }

}

