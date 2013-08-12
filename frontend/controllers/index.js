module.exports = function () {
	'use strict';
	return function (req, res, done) {
		done(null, {
			email: req.signedCookies.eml
		});
	};
};
