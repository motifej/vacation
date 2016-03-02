export default function phoneFilter() {
	return function(phone) {
		if (!phone) return;
		if (phone.length > 14) return phone.slice(0, 14);
		let p = phone
		.replace(/[^\d]/g, '')
		.replace(/(^\d{3})(\d)/g,'($1) $2')
		.replace(/(^\(\d{3}\)\s)(\d{3})(\d)/g, '$1$2-$3')
		return p;
	};
}