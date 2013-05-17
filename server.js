var express           = require('express'),
    async             = require('async'),
    auth              = require('./middleware/auth'),
    handlebarsAdapter = require('./lib/hb-adapter'),
    Config            = require('./lib/config'),
    config            = new Config('config.json'),
    app               = express();

app.use(config.ure(express.static, 'express.static'));
app.use(config.ure(express.logger, 'express.logger'));
app.use(config.ure(express.query, 'express.query'));
app.use(config.ure(express.bodyParser, 'express.bodyParser'));
app.use(config.ure(express.cookieParser, 'express.cookieParser'));
app.use(config.ure(express.session, 'express.session'));

app.use(app.router);
app.post('/register', config.ure(auth.register, 'auth.register'));
app.post('/login', config.ure(auth.login, 'auth.login'));
app.get('/logout', config.ure(auth.logout, 'auth.logout'));

app.engine('.html', handlebarsAdapter());
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