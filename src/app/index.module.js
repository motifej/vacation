/* global moment: false*/

import config  from './index.config';
import routerConfig  from './index.route';
import runBlock  from './index.run';
import LoginController from './pages/login/login.controller';
import UserController from './pages/user/user.controller';
import FirebaseService from './components/firebase/firebase.service';
import PermissionService from './components/persmissions/persmissions.service';
import NavbarDirective from './components/navbar/navbar.directive';
import DatepickerDirective from './components/datepicker/datepicker.directive';
import dropdownListDirective from './components/dropdown/vv.dropdown.directive';
import VvController  from './pages/admin/vv.controller';
import ManagerController  from './pages/manager/manager.controller';
import userFilterVacation from './cores/filters/userFilterVacation.filter';
import phoneFilter from '../app/components/manager/phoneFilter.filter';
import statusFilter from './cores/filters/status.filter';



angular.module('vacation', ['ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'firebase', 'toastr','mwl.calendar'])
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('firebaseService', FirebaseService)
  .service('permission', PermissionService)
  .filter('userFilterVacation', userFilterVacation)
  .filter('phoneFilter', phoneFilter)
  .filter('statusFilter', statusFilter)
  .controller('LoginController', LoginController)
  .controller('ManagerController', ManagerController)
  .controller('UserController', UserController)
  .controller('VvController', VvController)
  .directive('dropdownListDirective', dropdownListDirective)
  .directive('vacNavbar', NavbarDirective)
  .directive('vacDatepicker', DatepickerDirective)
