import { get } from 'lodash';
import * as routeStates  from '../../constants/routeStates.const';
import * as roles  from '../../constants/roles.consts';

export default class PermissionService {
	constructor ($rootScope, $state, firebaseService, toastr) {
		'ngInject';
		
		this.firebaseService = firebaseService;
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.toastr = toastr;
		
	}

	init (event, toState, toParams, fromState) {
				let _get = get;
        let roles = _get(toState, 'data.roles') || roles.ANONIM;
        if( !roles.length ){
          this.$rootScope.error = "Access undefined for this state";
          this.toastr.error(this.$rootScope.error);
          event.preventDefault();
          return;
        }

        if ( this.firebaseService.checkPersmissions(roles) ) {
          return;
        }

        this.$rootScope.error = "Seems like you tried accessing a route you don't have access to...";
        event.preventDefault();

        if( fromState.url === '^' ) {
            if( this.firebaseService.getAuthUser() ) {
                this.$state.go(routeStates.HOME);
            } else {
                this.$rootScope.error = null;
                this.$state.go(routeStates.LOGIN);
            }
        }
    }

}

