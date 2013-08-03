module.exports = function (options) {
	return function (req, res, next) {
		if (req.session.user && req.route.path === '/') {
			return res.redirect('/home');
		}
		next();
	};
};
