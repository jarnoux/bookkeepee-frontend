/*jslint nomen: true, forin: true */

var http = require('http'),
    Backend = function (options) {
        'use strict';
        this._options = options;
    },
    APIError = function (err) {
        'use strict';
        this.message = err.message;
        this.type = err.type;
        this.statusCode = err.statusCode;
    };

APIError.prototype = new Error();
APIError.prototype.constructor = APIError;

Backend.prototype.call = function call(moreOptions, body, callback) {
    'use strict';
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

Backend.prototype.APIError = APIError;

module.exports = Backend;
