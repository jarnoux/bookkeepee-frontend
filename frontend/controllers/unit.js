
module.exports = function () {
	'use strict';
	return function (req, res, done) {
		req.registry.get('models.unit').byId(req.params.id, function (err, result) {
			done(null, {
				// json: JSON.stringify(result),
				unit: result
			});
		});
	};
};
