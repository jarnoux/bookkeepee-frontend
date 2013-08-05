var Backend = require('./backend.js'),
	User    = function (options) {
		'use strict';
		this.backend = new Backend(options);
	};

User.prototype.login = function (body, callback) {
	'use strict';
	return this.backend.request({
		path: '/login',
		method: 'post'
	}, body, callback);
};
User.prototype.register = function (body, callback) {
	'use strict';
	return this.backend.request({
		path: '/register',
		method: 'post'
	}, body, callback);
};
User.prototype.logout = function (body, callback) {
	'use strict';
	return this.backend.request({
		path: '/logout',
		method: 'post'
	}, body, callback);
};

module.exports = function (options) {
	'use strict';
	return new User(options);
};
