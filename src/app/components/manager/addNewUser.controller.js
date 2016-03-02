export default class AddNewUserController {
  constructor ($filter, $modal, $modalInstance, toastr) {
    'ngInject';

    this.invalidForm = false;
    this.namePattern = '[a-zA-Zа-яА-Я]+';
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.filter = $filter;
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

		this.group = [
			'.Net',
			'Android',
			'Business Analyst',
			'Data Bases',
			'Design',
			'HR',
			'iOS',
			'IT',
			'Java',
			'JavaScript',
			'Managers',
			'Marketing Manager',
			'Markup',
			'NodeJS',
			'Operations',
			'PHP',
			'Python',
			'QA', 
			'Ruby',
			'Sales'
		];

		this.role = [
			'User',
			'Manager',
			'Admin',
		];

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

