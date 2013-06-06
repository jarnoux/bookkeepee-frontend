/*jslint nomen: true, sloppy: true */

var path              = require('path'),
    auth              = require('../middleware/auth'),
    dispatcher        = require('../middleware/dispatcher'),
    Config            = require('../lib/config'),
    config            = new Config('config.json'),
    Registry          = require('../middleware/registry'),
    registry          = new Registry(config),
    Router            = require('../lib/router'),
    router            = new Router({
        registry: registry,
        routes: 'routes.json'
    }),
    express           = require('express'),
    app               = express();

debugger;
registry.register(path.resolve(__dirname, '../middleware'));
registry.register(path.resolve(__dirname, 'models'));
registry.register(path.resolve(__dirname, 'controllers'));
registry.register({
    'app.router'           : function () {return app.router; },
    'express.static'       : express.static.bind(null, __dirname + '/static'),
    'express.logger'       : express.logger,
    'express.query'        : express.query,
    'express.bodyParser'   : express.bodyParser,
    'express.cookieParser' : express.cookieParser,
    'express.session'      : express.session,
    'express.errorHandler' : express.errorHandler,
    'middleware.registry'  : registry.middleware.bind(registry),
    'middleware.dispatcher': dispatcher,
    'middleware.auth'      : auth
});

router.map(app);

app.engine('.html', registry['middleware.hb-adapter']);

app.listen(3000);
console.log('front end app listening on port', 3000);
