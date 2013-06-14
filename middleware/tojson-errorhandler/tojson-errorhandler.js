
module.exports = function (options) {
    return function (err, req, res, next) {
        var type = err.name || err.constructor.name,
            status = options.statuses[type] || 500;

        res.writeHead(status);
        res.end(JSON.stringify({
            type: type,
            status: status,
            message: err.message
        }));
    };
};
