var express           = require('express'),
    handlebarsAdapter = require('./lib/hb-adapter'),
    perf              = require('./lib/perf'),
    auth              = require('./lib/auth'),
    app               = express();


app.engine('.html', handlebarsAdapter);

app.use(perf);
app.use(express.cookieParser('secret'));
app.use(express.session());
app.use(function (req, res, next) {
    req.session.user = 'jacquot';
    next();
});
app.use(auth);

app.use(function (req, res, next) {
    app.render('index.hb.html', {
        world: 'jacques'
    },
    function (err, html) {
        if (err) {
            res.send(err);
        } else {
            res.send(html);
        }
    });
});

app.listen(3000);
console.log('listening on port :', 3000);
