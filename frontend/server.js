/*jslint nomen: true*/

var Rig  = require('rig'),
    rig  = new Rig({
        config: 'config.json',
        routes: 'routes.json'
    });

rig.register('controllers');
rig.register('middleware');
rig.register('models');

rig.route();

rig.app.listen(3000);
console.log('front end app listening on port', 3000);
