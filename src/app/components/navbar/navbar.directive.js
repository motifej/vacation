import * as actions from '../../constants/actions.const';
import * as routeStates  from '../../constants/routeStates.const';
import * as roles  from '../../constants/roles.consts';

export default function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navbar/navbar.html',
    scope: {
    },
    controller: NavbarController,
    controllerAs: 'vm'
  };

  return directive;
}

class NavbarController {
  constructor (firebaseService, $rootScope, $scope) {
    'ngInject';
    this.firebaseService = firebaseService;
    this.routeStates = routeStates;
    this.user = {};
    this.activate($rootScope, $scope);
  }

  activate($rootScope, $scope) {
    let destr = $rootScope.$on(actions.USERLOADED,
                  (ev, user) => this.user = user );
    $scope.$on('destroy', destr);
  }

  logOut() {
    this.firebaseService.logOut();
    this.user = {};
  }

  isAdmin() {
    return this.user.role == roles.ADMIN;
  }

  isManager() {
    return this.user.role == roles.MANAGER;
  }
}
