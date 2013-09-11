'use strict';
/*jslint node: true */

var Backend = require('./backend.js'),
	Visit   = function (options) {
		this.backend = new Backend(options);
	};

Visit.prototype.find = function (body, callback) {
	this.backend.request({
		path: '/visits',
		method: 'post'
	}, body, callback);
};
Visit.prototype.create = function (body, callback) {
	this.backend.request({
		path: '/units/' + body.unitId + '/visits',
		method: 'put'
	}, body, callback);
};
Visit.prototype.byId = function (id, callback) {
	this.backend.request({
		path: '/visits/' + id
	}, callback);
};
Visit.prototype.edit = function (id, body, callback) {
	this.backend.request({
		path: '/visits/' + id,
		method: 'patch'
	}, body, callback);
};
Visit.prototype.delete = function (id, callback) {
	this.backend.request({
		path: '/visits/' + id,
		method: 'delete'
	}, callback);
};

module.exports = function (options) {
	return new Visit(options);
};
