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

rig.listen(3030);
console.log('back end app listening on port', 3030);
