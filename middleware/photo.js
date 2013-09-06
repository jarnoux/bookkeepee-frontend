/*jslint nomen: true, node: true */
'use strict';
var async = require('async'),
    Rig = require('rig'),
    registry = Rig.registry;

module.exports = {
    edit: function () {
        return function (req, res, next) {
            var nextFile,
                photoIds = [],
                nextPhoto = {
                    uploader: req.session.user._id,
                    unit: req.body.unitId
                },
                createPhotoTasks = [],
                photoModel = registry.get('models.photo'),
                unitModel = registry.get('models.unit');

            for (nextFile in req.s3.files) {
                if (req.s3.files[nextFile] && req.s3.files[nextFile].url) {
                    nextPhoto.url = req.s3.files[nextFile].url;
                    createPhotoTasks.push(photoModel.create.bind(photoModel, nextPhoto));
                }
            }
            async.parallel(createPhotoTasks, function (err, results) {
                results.forEach(function (photo) {
                    photoIds.push(photo._id);
                });
                if (results.length) {
                    return unitModel.edit(req.body.unitId, {
                            photos: photoIds
                        },
                        function (err, result) {
                            if (err) {
                                return next(err);
                            }
                            res.redirect('/units/' + req.body.unitId);
                        });
                }
                return res.redirect('/units/' + req.body.unitId);
            });
        };
    },
    delete: function () {
        return function (req, res, next) {
            registry.get('models.photo').delete(req.params.id, function (err, photo) {
                res.redirect('/units/' + photo.unit);
            });
        };
    }
};