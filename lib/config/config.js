var fs = require('fs'),
    Logwriter = require('../logwriter'),
    configModule = function (options) {
        var configFile  = options.configFile,
            app         = options.app,
            middlewares = options.middlewares,
            logWriter = new Logwriter({
                level: 'debug'
            });
        return function config(req, res, next) {
            fs.readFile(configFile, function (err, fileContent) {
                var parsedConfig = JSON.parse(fileContent),
                    i;
                if (err) {
                    return next(err);
                }
                for (i in middlewares) {

                    if (typeof middlewares[i] === 'function' && middlewares[i].name) {

                        app.use(middlewares[i].call(this, parsedConfig.middleware[middlewares[i].name]));
                    } else {
                        logWriter.warning('Config missing for middleware, not used: ' + i);
                    }
                }
                return next();
            });
        };
    };

module.exports = configModule;
