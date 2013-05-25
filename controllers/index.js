
module.exports = function () {
    'use strict';
    return function index(req) {
        return {
            username: req.session.user && req.session.user.username
        };
    };
};
