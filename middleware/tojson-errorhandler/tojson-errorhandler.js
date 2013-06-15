
module.exports = function (options) {
    'use strict';
    return function (err, req, res, next) {
        var type = err.name || err.constructor.name,
            status = options.statuses[type] || 500;

        res.writeHead(status);
        res.renderJSON({
            type: type,
            status: status,
            message: err.message
        }, function (err, string) {
            res.end(err || string);
        });
    };
};
