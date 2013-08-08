module.exports = function () {
	'use strict';
	return function (req, res, done) {
		return done(null, {
			email: req.signedCookies.eml
		});
	};
};
