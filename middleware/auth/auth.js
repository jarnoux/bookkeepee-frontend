var mongoose             = require('mongoose'),
    Schema               = mongoose.Schema,
    userSchema           = new Schema({
        username: { type: String, unique: true },
        email:    { type: String, unique: true },
        password: { type: String }
    }),
    User                 = mongoose.model('User', userSchema),
    validateRegisterData = function (options) {
        'use strict';
        return options.username && options.email && options.password;
    },
    authModule           = {};

mongoose = mongoose.connect('mongodb://localhost/bookkeepee');

authModule.register = function (options) {
    'use strict';
    return function register(req, res, next) {
        var newUser;
        if (!validateRegisterData(req.body)) {
            return next(new Error('Invalid input for registration: ' + JSON.stringify(req.body)));
        }

        newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        newUser.save(function (err) {
            if (err) {
                return next(err);
            }
            req.session.user = newUser;
            return res.redirect('/');
        });
    };
};
authModule.login = function (options) {
    'use strict';
    return function login(req, res, next) {
        if (!req.session.user) {
            User.findOne({
                email: req.body.email,
                password: req.body.password
            }, function (err, user) {
                if (err) {
                    return next(err);
                }
                req.session.user = user;
                return res.redirect('/');
            });
        } else {
            next();
        }
    };
};
authModule.logout = function (options) {
    'use strict';
    return function logout(req, res, next) {
        delete req.session.user;
        return res.redirect('/');
    };
};

module.exports = authModule;
