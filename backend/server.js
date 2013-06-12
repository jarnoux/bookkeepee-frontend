/*jslint nomen: true, sloppy: true */

var path        = require('path'),
    Config      = require('../lib/config'),
    config      = new Config('config.json'),
    Registry    = require('../middleware/registry'),
    registry    = new Registry(config),
    Router      = require('../lib/router'),
    router      = new Router({
        registry: registry,
        routes  : 'routes.json'
    }),
    express     = require('express'),
    app         = express();

registry.register(path.resolve(__dirname, '../middleware'));
registry.register(path.resolve(__dirname, 'models'));
registry.register(path.resolve(__dirname, 'controllers'));
registry.register({
    'app.router'           : function () {return app.router; },
    'express.logger'       : express.logger,
    'express.query'        : express.query,
    'express.bodyParser'   : express.bodyParser,
    'express.errorHandler' : express.errorHandler,
    'middleware.registry'  : registry.middleware.bind(registry)
});

router.map(app);

app.listen(3030);
console.log('back end app listening on port', 3030);
