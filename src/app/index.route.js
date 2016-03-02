import * as roles  from './constants/roles.consts';
import * as states  from './constants/routeStates.const';

export default function routerConfig ($stateProvider, $urlRouterProvider) {
    'ngInject';

    $stateProvider
    .state(states.LOGIN, {
        url: '/login',
        data: {
            roles: roles.ANONIM
        },
        views: {
          'content@': {
            templateUrl: 'app/pages/login/login.html',
            controller: 'LoginController',
            controllerAs: 'main'
          }
        }
    })
    .state(states.SITE, {
        'abstract': true,
        resolve: {
            user : function (firebaseService) {
                'ngIngect'
                return firebaseService.loadUser();
            }
        }
    })
    .state(states.HOME, {
        parent: states.SITE,
        url: '/',
        data: {
            roles: roles.USER
        },
        views: {
          'content@': {
            templateUrl: 'app/pages/user/user.html',
            controller: 'UserController',
            controllerAs: 'userCtrl'
            }
        }
    })
    .state(states.ADMIN, {
        parent: states.SITE,
        url: '/admin',
        data: {
            roles: roles.ADMIN
        },
        resolve: {
            userList : function (firebaseService) {
                'ngIngect'
                return firebaseService.getUsersList();
            }
        },
        views: {
          'content@': {
            templateUrl: 'app/pages/admin/vv.html',
            controller: 'VvController',
            controllerAs: 'vv'
            }
        }
    })
    .state(states.MANAGER, {
        parent: states.SITE,
        url: '/manager',
        data: {
            roles: roles.MANAGER
        },
        resolve: {
            userList : function (firebaseService) {
                'ngIngect'
                return firebaseService.getUsersList();
            }
        },

        views: {
          'content@': {
            templateUrl: 'app/pages/manager/manager.html',
            controller: 'ManagerController',
            controllerAs: 'manager'
            }
        }
    });

    $urlRouterProvider.otherwise('/');

}
