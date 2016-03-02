export default function userFilterVacation() {
	return function(input, status) {
		if (input) {
			switch (status) {
				case 'requests':
				return input.filter(function(item) {
					return item.confirm == false;
				});
				case 'approved':
				return input.filter(function(item) {
					return item.endDate > new Date() && item.confirm == true;
				});
				case 'spent':
				return input.filter(function(item) {
					return item.endDate < new Date() && item.confirm == true;
				});
			}
		}
	};
}