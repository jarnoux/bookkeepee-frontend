/*jslint nomen: true*/

var mongoose = require('mongoose'),
    Rig      = require('rig'),
    rig      = new Rig({
        config: 'config.yaml',
        routes: 'routes.yaml'
    });

rig.register('controllers');
rig.register('middleware');
rig.register('models');

rig.route();

mongoose = mongoose.connect('mongodb://localhost/bookkeepee');

rig.listen(3030);
console.log('back end app listening on port', 3030);
