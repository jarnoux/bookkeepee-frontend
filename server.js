/*jslint nomen: true*/

var Rig  = require('rig'),
    rig  = new Rig({
        config: 'config.yaml',
        routes: 'routes.yaml'
    });

require('aws-sdk').config.loadFromPath('./aws-credentials.json');

rig.register('controllers');
rig.register('middleware');
rig.register('models');

rig.route();

rig.listen(3000);
console.log('front end app listening on port', 3000);
