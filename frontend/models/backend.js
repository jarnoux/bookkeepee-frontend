var http = require('http'),
    Backend = function (options) {
        this._options = options;
    };

Backend.prototype.call = function call(moreOptions, body, callback) {
    var reqOptions,
        nextOptionKey,
        backendRequest;
    reqOptions = this._options[moreOptions.method || 'get'] || {};
    // merge options with precedence to given arguments
    for (nextOptionKey in moreOptions) {
        reqOptions[nextOptionKey] = moreOptions[nextOptionKey];
    }

    backendRequest = http.request(reqOptions, function (res) {
        res.on('readable', function () {
            var err,
                result;
            try {
                result = JSON.parse(res.read());
                if (res.statusCode !== 200) {
                    err = new APIError(result);
                }
            } catch (e) {
                err = e;
            }
            callback(err, result);
        });
    });
    if (body) {
        backendRequest.end(body);
    }

    return backendRequest;
};
module.exports = Backend;
