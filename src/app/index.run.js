export default function runBlock ($log, $rootScope, $state, firebaseService,toastr, permission) {
  'ngInject';
   
  let destr = $rootScope.$on("$stateChangeStart", permission.init.bind(permission));

  $rootScope.$on('$destroy', destr);

  $log.debug('runBlock end');

}