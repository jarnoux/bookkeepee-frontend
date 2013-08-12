
module.exports = function () {
	'use strict';
	return function (req, res, done) {
		req.registry.get('models.unit').byId(req.params.id, function (err, result) {
			result.editable = req.session.user && (req.session.user._id === result.owner._id);
			done(null, {
				unit: result
			});
		});
	};
};
