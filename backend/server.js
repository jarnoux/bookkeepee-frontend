/*jslint nomen: true*/

var path = require('path'),

	Rig  = require('rig'),
    rig  = new Rig({
        config: 'config.yaml',
        routes: 'routes.yaml'
    });

rig.register('controllers');
rig.register('middleware');
rig.register('models');

rig.route();

rig.listen(3030);
console.log('back end app listening on port', 3030);
