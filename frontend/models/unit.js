'use strict';
/*jslint node: true */

var Backend = require('./backend.js'),
	Unit    = function (options) {
		this.backend = new Backend(options);
	};


Unit.prototype.byProperty = function (propertyId, callback) {
	this.backend.request({
		path: '/properties/' + propertyId + '/units'
	}, callback);
};
Unit.prototype.create = function (propertyId, body, callback) {
	this.backend.request({
		path: '/properties/' + propertyId + '/units',
		method: 'put'
	}, body, callback);
};
Unit.prototype.byId = function (unitId, callback) {
	this.backend.request({
		path: '/units/' + unitId
	}, callback);
};
Unit.prototype.edit = function (propertyId, unitId, body, callback) {
	this.backend.request({
		path: '/units/' + unitId,
		method: 'patch'
	}, body, callback);
};
Unit.prototype.remove = function (propertyId, unitId, callback) {
	this.backend.request({
		path: '/units/' + unitId,
		method: 'delete'
	}, callback);
};
Unit.prototype.find = function (body, callback) {
	this.backend.request({
		path: '/units',
		method: 'post'
	}, body, callback);
};

module.exports = function (options) {
	return new Unit(options);
};
