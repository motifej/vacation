/*eslint-disable */
export default function runBlock ($log, $rootScope, permission) {
	'ngInject';

	$rootScope.$on("$stateChangeStart", permission.init);

	$log.debug('runBlock end');

}