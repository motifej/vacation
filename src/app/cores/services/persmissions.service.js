import * as routeStates  from '../../constants/routeStates.const';
import { ANONIM }  from '../../constants/roles.consts';

let _this = {};

export default class PermissionService {
	constructor ($rootScope, $state, firebaseService, toastr, $parse) {
		'ngInject';
		
		_this.firebaseService = firebaseService;
		_this.$rootScope = $rootScope;
		_this.$state = $state;
		_this.toastr = toastr;
    _this.$parse = $parse;
		
	}


	init (event, toState, toParams, fromState) {
        let roles = _this.$parse('data.roles')(toState) || ANONIM;
        if( !roles.length ){
          _this.toastr.error(this.$rootScope.error);
          event.preventDefault();
          return;
        }

        if ( _this.firebaseService.checkPersmissions(roles) ) {
          return;
        }

        event.preventDefault();

        if( fromState.url === '^' ) {
            if( _this.firebaseService.getAuthUser() ) {
                _this.$state.go(routeStates.HOME);
            } else {
                _this.$state.go(routeStates.LOGIN);
            }
        }
    }

}

