import * as routeStates  from '../../constants/routeStates.const';

export default class LoginController {
  constructor ($log, $state, $scope, firebaseService,toastr) {
    'ngInject';

     this.$state = $state;
     this.$log = $log;
     this.toastr = toastr;
     this.$scope = $scope;
     this.sending = false;
     this.firebaseService = firebaseService;
  }

  signin () {
    if(this.$scope.loginForm.$invalid) {
      this.toastr.warning('Fieldes hasn\'t be empty!');
      return
    }
    this.sending = true;
    let _this = this;
    this.firebaseService.signInUserByEmail({
      email: this.email,
      password: this.passw
    }).then( () => {
        _this.$state.go(routeStates.HOME);
    }).catch( err => {
      _this.toastr.error(err.error.message, err.error.code);
      _this.$log.error(err);
      _this.sending = false;
    });
  }
  
}
