
module.exports = function () {
    return function (req, res, next) {
        var action = req.path.substr(1);
        var user = req.session.user;
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
