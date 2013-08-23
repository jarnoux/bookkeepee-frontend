'use strict';
/*jslint node: true */

var Backend = require('./backend.js'),
	Photo   = function (options) {
		this.backend = new Backend(options);
	};

Photo.prototype.find = function (body, callback) {
	this.backend.request({
		path: '/photos',
		method: 'post'
	}, body, callback);
};
Photo.prototype.create = function (body, callback) {
	this.backend.request({
		path: '/photos',
		method: 'put'
	}, body, callback);
};
Photo.prototype.byId = function (id, callback) {
	this.backend.request({
		path: '/photo/' + id
	}, callback);
};
Photo.prototype.edit = function (id, body, callback) {
	this.backend.request({
		path: '/photo/' + id,
		method: 'patch'
	}, body, callback);
};
Photo.prototype.remove = function (id, callback) {
	this.backend.request({
		path: '/photo/' + id,
		method: 'delete'
	}, callback);
};

module.exports = function (options) {
	return new Photo(options);
};
