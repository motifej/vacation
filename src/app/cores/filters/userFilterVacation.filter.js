import { filter } from 'lodash';

export default function userFilterVacation() {
	return function(input, status) {
		if (input) {
			switch (status) {
				case 'requests':
				return filter(input, function(item) {
					return item.status == 'inprogress';
				});
				case 'rejected':
				return filter(input, function(item) {
					return item.status == 'rejected';
				});
				case 'approved':
				return filter(input, function(item) {
					return item.endDate > new Date() && item.status == 'confirmed';
				});
				case 'spent':
				return filter(input, function(item) {
					return item.endDate < new Date() && item.status == 'confirmed';
				});
			}
		}
	};
}