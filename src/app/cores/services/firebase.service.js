/*global Firebase: false, $: false, moment: false*/
import * as actions from '../../constants/actions.const';
import * as users  from '../../constants/users.consts';
import { API_URL } from '../../constants/api.consts';

export default class FirebaseService {
	constructor ($firebaseArray, $firebaseObject, $firebase, $firebaseAuth, $q, $rootScope, $firebaseUtils, $timeout, moment, $parse) {
		'ngInject';
		this.URL = API_URL;
		this.$firebaseObject = $firebaseObject;
		this.$firebaseAuth = $firebaseAuth;
		this.$firebaseArray = $firebaseArray;
		this.$firebaseUtils = $firebaseUtils;
		this.toJSON = $firebaseUtils.toJSON;
		this.$parse = $parse;
		this.$q = $q;
		this.$timeout = $timeout;
		this.$rootScope = $rootScope;
		this.userStorageKey = 'authUser';
		this.firebaseObj = new Firebase( this.URL );
		this.authUser = $.jStorage.get( this.userStorageKey ) || { status:false, data: false };
		this.userData = {};
	}

	_getCurrentUid() {
		return this.authUser.data.uid;
	}

	checkPersmissions(arr) {
		return !!~arr.indexOf(this.authUser.role || users.ANONIM);
	}

	getUsersList() {
		let deferred = this.$q.defer();
		this.$firebaseArray( this.firebaseObj ).$loaded(
			data =>	deferred.resolve( data ),
			error => deferred.reject(error) );
		return deferred.promise;
	}

	loadUser() {
		let deferred = this.$q.defer();
		let userRef = this.firebaseObj.child(this.authUser.data.uid);
		let timeoutLoad = this.$timeout(deferred.reject, 10000);
		this.$firebaseObject( userRef ).$loaded(
			data => {
				this.$timeout.cancel( timeoutLoad );
				deferred.resolve( data );
				this.$rootScope.$emit(actions.USERLOADED, data);
			},
			error => deferred.reject(error) );
		return deferred.promise;
	}

	updateUserData(data) {
		let deferred = this.$q.defer();
		this.firebaseObj.update({ [data.uid]: this.toJSON(data) }, 
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

	removeVacation(id) {
		let deferred = this.$q.defer();
		let vacationsRef = this.firebaseObj.child(this.authUser.data.uid).child('vacations');
		this.$firebaseObject(vacationsRef).$loaded(
			data => {
				let vacation = this.$parse('list["' + id + '"]')(data);
				if (data.list[id].status === 'confirmed') {
					let startDate = vacation.startDate;
					let endDate = vacation.endDate;
					let retDays = (startDate && endDate) ? moment().isoWeekdayCalc(startDate, endDate, [1,2,3,4,5]) : 0;
					data.total += retDays;
					data.$save();
				}
				vacationsRef.child('list').child(id).remove();
				deferred.resolve();
			},
			error => deferred.reject(error));
		return deferred.promise;
	}

	createUserByEmail(newUser) {
		let deferred = this.$q.defer();
		this.firebaseObj.createUser({
			email    : newUser.email,
			password : newUser.password
		}, (error, userData) => {
			if (error === null) {
				delete newUser.password;
				let user = angular.extend(newUser, {uid: userData.uid});
				deferred.resolve(this.updateUserData( user ))
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
			$.jStorage.set(_this.userStorageKey, _this.toJSON(_this.authUser));
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
			$.jStorage.set(this.userStorageKey, this.toJSON(this.authUser));
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