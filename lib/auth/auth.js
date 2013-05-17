var mongoose             = require('mongoose'),
    Schema               = mongoose.Schema,
    userSchema           = new Schema({
        username: { type: String, unique: true },
        email:    { type: String, unique: true },
        password: { type: String }
    }),
    User                 = mongoose.model('User', userSchema),
    validateRegisterData = function (options) {
        return options.username && options.email && options.password;
    },
    authModule           = {};

try {
    mongoose = mongoose.connect('mongodb://localhost/bookkeepee');
} catch (err) {

}

authModule.register = function (options) {
    return function register(req, res, next) {
        var newUser;
        if (req.method !== 'POST') {
            return res.redirect('/');
        }
        if (!validateRegisterData(req.body)) {
            return next(new Error('Invalid input for registration: ' + JSON.stringify(req.body)));
        }

        newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        newUser.save(function (err) {
            if (err) return next(err);
            else {
                req.session.user = newUser;
                return res.redirect('/');
            }
        });
    };
};
authModule.login = function (options) {
    return function login(req, res, next) {
        if (!req.session.user && req.method === 'POST') {
            User.findOne({
                email: req.body.email,
                password: req.body.password
            }, function (err, user) {
                if (err) next(err);
                req.session.user = user;
                return res.redirect('/');
            });
        } else next();
    };
};
authModule.logout = function (options) {
    return function logout(req, res, next) {
        delete req.session.user;
        return res.redirect('/');
    };
};

module.exports = authModule;
