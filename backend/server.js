/*jslint nomen: true, sloppy: true */

var path = require('path'),
    Rig  = require('rig'),
    rig  = new Rig({
        config: 'config.json',
        routes: 'routes.json'
    });

rig.register(path.resolve(__dirname, 'controllers'));
rig.register(path.resolve(__dirname, 'middleware'));
rig.register(path.resolve(__dirname, 'models'));

rig.map();

rig.app.listen(3030);
console.log('back end app listening on port', 3030);
