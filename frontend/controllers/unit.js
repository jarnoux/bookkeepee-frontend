
module.exports = function () {
	'use strict';
	return function (req, res, done) {
		req.registry.get('models.unit').byId(req.params.id, function (err, results) {
			done(null, {
				unit: JSON.stringify(results, null, 4)
			});
		});
	};
};
