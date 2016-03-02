/*global Firebase: false, $: false*/
import * as actions from '../../constants/actions.const';
import * as users  from '../../constants/users.consts';
import { API_URL } from '../../constants/api.consts';

export default class FirebaseService {
	constructor ($firebaseArray, $firebaseObject, $firebase, $firebaseAuth, $q, $rootScope, $firebaseUtils) {
		'ngInject';
		this.URL = API_URL;
		this.$firebaseObject = $firebaseObject;
		this.$firebaseAuth = $firebaseAuth;
		this.$firebaseArray = $firebaseArray;
		this.$q = $q;
		this.$rootScope = $rootScope;
		this.userStorageKey = 'authUser';
		this.firebaseObj = new Firebase( this.URL );
		this.authUser = $.jStorage.get( this.userStorageKey ) || { status:false, data: false };
		this.userData = {};
		this.$firebaseUtils = $firebaseUtils;
	}

	_getClearArray(arr) {
		let newArr = [];
		angular.forEach(arr, 
			value => newArr.push(value)
			);
		return newArr;
	}

	_getCurrentUid() {
		return this.authUser.data.uid;
	}

	checkPersmissions(arr) {
		return !!~arr.indexOf(this.authUser.role || users.ANONIM);
	}

	getUsersList() {
		let arr = this._getClearArray;
		let deferred = this.$q.defer();
		this.$firebaseArray( this.firebaseObj ).$loaded(
			data =>	deferred.resolve( data ),
			error => deferred.reject(error) );
		return deferred.promise;
	}

	loadUser() {
		let obj = this.$firebaseUtils.toJSON;
		let deferred = this.$q.defer();
		let userRef = this.firebaseObj.child(this.authUser.data.uid);
		this.$firebaseObject( userRef ).$loaded(
			data => {
				deferred.resolve( obj( data ) );
				this.$rootScope.$emit(actions.USERLOADED, data);
			},
			error => deferred.reject(error) );
		return deferred.promise;
	}

	updateUserData(data) {
		let deferred = this.$q.defer();
		this.firebaseObj.update({ [data.uid]: this.$firebaseUtils.toJSON(data) }, 
			error => {
				if (error === null) {
					deferred.resolve({status: true})
				} else {
					deferred.reject({status: false, error: error})
				}
			}
			);
		return deferred.promise;
	}

	createNewVacation(data) {
		let ref = this.firebaseObj.child(this.authUser.data.uid).child('vacations').child('list');
		let refNewVacation = ref.push();
		let newVacation = angular.extend(data, {id: refNewVacation.key()});
		refNewVacation.set(newVacation);
	}

	createUserByEmail(newUser) {
		let deferred = this.$q.defer();
		this.firebaseObj.createUser({
			email    : newUser.email,
			password : newUser.password
		}, (error, userData) => {
			if (error === null) {
				delete newUser.password;
				let user = angular.extend(this.defaultData, newUser, {uid: userData.uid});
				deferred.resolve(this.updateUserData(userData.uid, user))
			} else {
				deferred.reject({
					status: false,
					error: error
				});
			}
		});
		return deferred.promise;
	}
	
	signInUserByEmail(user) {
		let _this = this;
		let deferred = _this.$q.defer();
		this.firebaseObj.authWithPassword(user, function(error, data) {
			if (error === null) {
				_this.authUser.data = {};
				_this.authUser.data.uid = data.uid;
				_this.loadUser().then(signInSuccess, signInError)
			} else {
				signInError(error);
			}
		});
		return deferred.promise;

		function signInSuccess(data){
			_this.authUser = {
				status: true,
				data: data,
				role: data.role
			};
			_this.userData = data;
			deferred.resolve(_this.authUser);
			$.jStorage.set(_this.userStorageKey, _this.authUser);
		}
		
		function signInError(error){
			deferred.reject({
				status: false,
				error: error
			});
			_this.logOut();	
		}
	}

	deleteUser(email, password) {
		let deferred = this.$q.defer();
		this.firebaseObj.removeUser({
			email    : email,
			password : password
		}, error => {
			if (error === null) {
				deferred.resolve({status: true});
			} else {
				deferred.reject({
					status: false,
					error: error
				})
			}
		});
		return deferred.promise;
	}

	getUserState() {
		if (this.authUser.data) {
			let data = this.firebaseObj.getAuth();
			this.authUser = {
				status: data ? true : false,
				data: (data == null) ? {} : data,
				role: this.authUser.role
			};
			$.jStorage.set(this.userStorageKey, this.authUser);
		}
		return this.authUser.status;
	}

	logOut() {
		this.$firebaseAuth(this.firebaseObj).$unauth();
		$.jStorage.deleteKey(this.userStorageKey);
		this.authUser = {status: false, data: false}
	}

	getAuthUser() {
		return this.authUser.data;
	}

	changeUserPass(email, oldPassword, newPassword) {
		let deferred = this.$q.defer();
		this.firebaseObj.changePassword({
			email       : email,
			oldPassword : oldPassword,
			newPassword : newPassword
		}, error => {
			if (error === null) {
				deferred.resolve({status: true});
			} else {
				deferred.reject({status: false, error: error});
			}
		});
		return deferred.promise;
	}
	
	resetAndSendPassword(email) {
		let deferred = this.$q.defer();
		this.firebaseObj.resetPassword({
			email : email
		}, error => {
			if (error === null) {
				deferred.resolve({status: true});
			} else {
				deferred.reject({status: false, error: error});
			}
		});
		return deferred.promise;
	}

}