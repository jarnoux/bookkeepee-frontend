var express           = require('express'),
    handlebarsAdapter = require('./lib/hb-adapter'),
    auth              = require('./lib/auth'),
    config            = require('./lib/config'),
    app               = express();


app.engine('.html', handlebarsAdapter());


app.use(app.router);
app.use(express.static(__dirname + '/static'));

app.use(config({
    configFile: 'config.json',
    app: app,
    middlewares: [express.logger]
}));
// app.use(express.logger({
//     format: '{date: ":date", msec: ":response-time", ' +
//         'addr: ":remote-addr", usag: ":user-agent", refr: ":referrer", ' +
//         'req: ":method :url", resp: ":status :res[content-length]"}'
// }));

app.use(express.query());
app.use(express.bodyParser());
app.use(express.cookieParser('secret'));
app.use(express.session());

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
