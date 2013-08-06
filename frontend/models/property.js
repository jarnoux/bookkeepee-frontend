'use strict';
/*jslint node: true */

var querystring = require('querystring'),
	Backend     = require('./backend.js'),
	Property    = function (options) {
		this.backend = new Backend(options);
	};

Property.prototype = {
	find: function (body, callback) {
		this.backend.request({
			path: '/properties',
			method: 'post'
		}, body, callback);
	},
	create: function (body, callback) {
		this.backend.request({
			path: '/properties',
			method: 'put'
		}, body, callback);
	},
	byId: function (id, callback) {
		this.backend.request({
			path: '/properties/' + id
		}, callback);
	},
	edit: function (id, body, callback) {
		this.backend.request({
			path: '/properties/' + id,
			method: 'patch'
		}, body, callback);
	},
	remove: function (id, callback) {
		this.backend.request({
			path: '/properties/' + id,
			method: 'delete'
		}, callback);
	}
};

module.exports = function (options) {
	return new Property(options);
};
