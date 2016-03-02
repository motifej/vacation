export
default
function statusFilter() {
    return function(input, filterKey, filterVal) {
    	if(!filterVal) return input;
        var filteredInput = {};
        angular.forEach(input, function(value, key) {
            if (value[filterKey] && value[filterKey] == filterVal) {
                filteredInput[key] = value;
            }
        });
        return filteredInput;
    }
}