var querystring = require('querystring'),
	Backend     = require('./backend.js'),
	Unit        = function (options) {
		'use strict';
		this.backend = new Backend(options);
	};


Unit.prototype.byProperty = function (propertyId, callback) {
	'use strict';
	this.backend.request({
		path: '/properties/' + propertyId + '/units'
	}, callback);
};
Unit.prototype.create = function (propertyId, body, callback) {
	'use strict';
	this.backend.request({
		path: '/properties/' + propertyId + '/create',
		method: 'put'
	}, body, callback);
};
Unit.prototype.byId = function (propertyId, unitId, callback) {
	'use strict';
	this.backend.request({
		path: '/properties/' + propertyId + '/units/' + unitId
	}, callback);
};
Unit.prototype.edit = function (propertyId, unitId, body, callback) {
	'use strict';
	this.backend.request({
		path: '/properties/' + propertyId + '/units/' + unitId,
		method: 'patch'
	}, body, callback);
};
Unit.prototype.remove = function (propertyId, unitId, callback) {
	'use strict';
	this.backend.request({
		path: '/properties/' + propertyId + '/units/' + unitId,
		method: 'delete'
	}, callback);
};
Unit.prototype.find = function (body, callback) {
	'use strict';
	this.backend.request({
		path: '/units/find',
		method: 'post'
	}, body, callback);
};

module.exports = function (options) {
	'use strict';
	return new Unit(options);
};
