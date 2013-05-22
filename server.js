/*jslint nomen: true, sloppy: true */
var path              = require('path'),
    auth              = require('./middleware/auth'),
    dispatcher        = require('./middleware/dispatcher'),
    Config            = require('./lib/config'),
    config            = new Config('config.json'),
    Registry          = require('./lib/registry'),
    registry          = new Registry(config),
    Router            = require('./lib/router'),
    router            = new Router({
        registry: registry,
        routes: 'routes.json'
    }),
    express           = require('express'),
    app               = express();

registry.register(path.join(__dirname, 'middleware'));
registry.register({
    'hb-adapter'          : path.join(__dirname, 'lib/hb-adapter'),
    'express.static'      : express.static,
    'express.logger'      : express.logger,
    'express.query'       : express.query,
    'express.bodyParser'  : express.bodyParser,
    'express.cookieParser': express.cookieParser,
    'express.session'     : express.session,
    'app.router'          : function () {return app.router; },
    'auth.login'          : auth.login,
    'auth.register'       : auth.register,
    'auth.logout'         : auth.logout,
    'dispatcher'          : dispatcher.bind(this, registry),
    'express.errorHandler': express.errorHandler
});

router.map(app);

app.engine('.html', registry['hb-adapter']);

app.listen(3000);
console.log('app listening on port', 3000);
