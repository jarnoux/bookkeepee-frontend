var microtime  = require('microtime');

module.exports = function (req, res, next) {
    var tic = microtime.now();
    res.on('finish', function () {
        console.log('time : ', microtime.now() - tic);
    });
    next();
};
