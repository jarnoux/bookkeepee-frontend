var express           = require('express'),
    async             = require('async'),
    path = require('path'),
    auth              = require('./middleware/auth'),
    handlebarsAdapter = require('./lib/hb-adapter'),
    Config            = require('./lib/config'),
    config            = new Config('config.json'),
    app               = express(),
    Registry = require('./lib/registry'),
    registry = new Registry(config);

registry.register(path.join(__dirname, 'lib'));
registry.register(path.join(__dirname, 'middleware'));

registry.register('express.static', express.static);
registry.register('express.logger', express.logger);
registry.register('express.query', express.query);
registry.register('express.bodyParser', express.bodyParser);
registry.register('express.cookieParser', express.cookieParser);
registry.register('express.session', express.session);
registry.register('express.errorHandler', express.errorHandler);

app.use(registry['express.static']);
app.use(registry['express.logger']);
app.use(registry['express.query']);
app.use(registry['express.bodyParser']);
app.use(registry['express.cookieParser']);
app.use(registry['express.session']);

app.use(app.router);

app.post('/register', config.ure(auth.register, 'auth.register'));
app.post('/login', config.ure(auth.login, 'auth.login'));
app.get('/logout', config.ure(auth.logout, 'auth.logout'));

app.engine('.html', registry['hb-adapter']);

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


app.use(registry['express.errorHandler']);

app.listen(3000);
console.log('app listening on port', 3000);