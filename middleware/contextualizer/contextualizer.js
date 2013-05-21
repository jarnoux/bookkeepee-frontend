module.exports = function (options) {
    return function (req, res, next) {
        req.context = {};
        // start by taking all the context configs
        for (var key in options) {
            req.context[key] = options[key];
        }
        next();
    };
};
