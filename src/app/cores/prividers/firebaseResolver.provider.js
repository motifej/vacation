import states from '../../constants/routeStates.const';

export default function FirebaseResolverProvider () {
    this.loadUser = loadUser;
    this.getUsersList = getUsersList;
    this.$get = () => this;
}

function loadUser (firebaseService, $state) {
    "ngInject";
    return firebaseService
            .loadUser()
            .catch( err =>
                $state.go(states.ERRLOAD,{err: err}) );
}

function getUsersList(firebaseService) {
    'ngIngect'
    return firebaseService.getUsersList();
}