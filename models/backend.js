/*jslint node: true,nomen: true, forin: true */
'use strict';

var http        = require('http'),
    querystring = require('querystring'),
    Backend     = function (options) {
        this._options = options;
    },
    APIError = function (err) {
        this.name    = 'APIError';
        this.message = err.message;
        this.type    = err.type;
        this.status  = err.status;
    };

APIError.prototype = new Error();
APIError.prototype.constructor = APIError;

Backend.prototype.request = function (moreOptions, body, callback) {
    var reqOptions = {},
        methodOptions = this._options[moreOptions.method || 'get'] || {},
        nextOptionKey,
        backendRequest;

    if (!callback) {
        callback = body;
        body = null;
    }
    for (nextOptionKey in this._options['*']) {
        reqOptions[nextOptionKey] = this._options['*'][nextOptionKey];
    }
    // merge options with method defaults
    for (nextOptionKey in methodOptions) {
        reqOptions[nextOptionKey] = methodOptions[nextOptionKey];
    }
    // merge options with precedence to given arguments
    for (nextOptionKey in moreOptions) {
        reqOptions[nextOptionKey] = moreOptions[nextOptionKey];
    }

    backendRequest = http.request(reqOptions, function (res) {
        var buffer = '';
        res.on('data', function (data) {
            buffer += data;
        });
        res.on('end', function () {
            var err,
                result;
            try {
                result = JSON.parse(buffer);
                if (res.statusCode >= 400) {
                    err = new APIError(result);
                }
            } catch (e) {
                e.message = buffer;
            }
            callback(err, result);
        });
        res.on('error', function (err) {
            callback(err);
        });
    });
    backendRequest.on('error', callback);
    backendRequest.end(querystring.stringify(body));

    return backendRequest;
};

Backend.prototype.APIError = APIError;

module.exports = Backend;

