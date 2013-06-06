var e_validator = require('express-validator'),
    ValidationError = function (errors) {
        this._errors = errors;
    };

ValidationError.prototype = new Error();
ValidationError.prototype.constructor = ValidationError;
ValidationError.prototype.toString = function() {
    JSON.stringify(this._errors);
};

module.exports = function (options) {
    var myValidator = function (req, res, next) {
        var error,
            nextParam,
            nextAssertion,
            nextAssertMethods,
            nextAssertMethod,
            nextSanitization,
            nextSanitizeMethods,
            nextSanitizeMethod,
            routeValidation = options[req.route.path];

        for (nextParam in routeValidation) {
            nextAssertion       = req.assert(nextParam, routeValidation[nextParam].errorMessage);
            nextAssertMethods   = routeValidation[nextParam].assert;
            for (nextAssertMethod in nextAssertMethods) {
                nextAssertion[nextAssertMethod].call(nextAssertion, nextAssertMethods[nextAssertMethod]);
            }

            nextSanitization    = req.sanitize(nextParam);
            nextSanitizeMethods = routeValidation[nextParam].sanitize;
            for (nextSanitizeMethod in nextSanitizeMethods) {
                nextSanitization[nextSanitizeMethod].call(nextSanitization, nextSanitizeMethods[nextSanitizeMethod]);
            }
        }

        error = req.validationErrors(true);
        if (error) {
            next(new ValidationError(error));
        } else {
            next();
        }
    };

    return function validator(req, res, next) {
        e_validator(req, res, myValidator.bind(null, req, res, next));
    };
};
