
module.exports = function (options) {
    var registry = options && options.registry;
    return function (req, res, next) {
        if (!registry) return next(new Error('Dispatcher needs runtime Registry'));

        var action = req.path.substr(1),
            user = req.session.user;
        res.render('index.hb.html', {
            username: (user ? user.username : null)
        },

        function (err, html) {
            if (err) {
                next(err);
            } else {
                res.send(html);
            }
        });
    };
};
