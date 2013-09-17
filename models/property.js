'use strict';
/*jslint node: true */

var Backend  = require('./backend.js'),
	Property = function (options) {
		this.backend = new Backend(options);
	};

Property.prototype.find = function (body, callback) {
	this.backend.request({
		path: '/properties',
		method: 'post'
	}, body, callback);
};
Property.prototype.findOrCreate = function (body, callback) {
	this.backend.request({
		path: '/properties',
		method: 'put'
	}, body, callback);
};
Property.prototype.byId = function (id, callback) {
	this.backend.request({
		path: '/properties/' + id
	}, callback);
};
Property.prototype.edit = function (id, body, callback) {
	this.backend.request({
		path: '/properties/' + id,
		method: 'patch'
	}, body, callback);
};
Property.prototype.remove = function (id, callback) {
	this.backend.request({
		path: '/properties/' + id,
		method: 'delete'
	}, callback);
};

module.exports = function (options) {
	return new Property(options);
};
