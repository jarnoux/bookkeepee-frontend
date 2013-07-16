module.exports = function (options) {
	'use strict';
	return function property(req, res, next) {
		req.renderJSON([{
			title: 'Property 1',
			description: 'description 1'
		}, {
			title: 'property 2',
			description: 'description 2'
		}], function (err, result) {
			res.end(result);
		});
	};
};
