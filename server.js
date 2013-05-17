var express           = require('express'),
    async             = require('async'),
    handlebarsAdapter = require('./lib/hb-adapter'),
    auth              = require('./lib/auth'),
    Config            = require('./lib/config'),
    config            = new Config('config.json'),
    app               = express();

app.engine('.html', handlebarsAdapter());

app.use(app.router);
app.use(config.ure(express.static, 'express.static'));
app.use(config.ure(express.logger, 'express.logger'));
app.use(config.ure(express.query, 'express.query'));
app.use(config.ure(express.bodyParser, 'express.bodyParser'));
app.use(config.ure(express.cookieParser, 'express.cookieParser'));
app.use(config.ure(express.session, 'express.session'));

app.use('/register', auth.register());
app.use('/login', auth.login());
app.use('/logout', auth.logout());
app.use(function (req, res, next) {
    var user = req.session.user;
    app.render('index.hb.html', {
        username: (user ? user.username : null)
    },

    function (err, html) {
        if (err) {
            res.send(err);
        } else {
            res.send(html);
        }
    });
});

app.use(express.errorHandler());

app.listen(3000);
console.log('app listening on port', 3000);