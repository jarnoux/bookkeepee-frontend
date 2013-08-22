var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    _ = require('underscore'),
    S3 = require('aws-sdk').S3;

module.exports = function (options) {
    var s3 = new S3(),
        streamToS3 = function (file, callback) {
            var filePath = file.path,
                s3key = new Date().getTime() + file.name;
            s3.putObject({
                ACL: "public-read",
                Body: fs.createReadStream(filePath),
                Bucket: options.Bucket,
                Key: s3key
            }, function (err, result) {
                file.url = path.join('s3-us-west-1.amazonaws.com/', options.Bucket, s3key);
                callback(err, file);
            });
        },
        /**
         * Create a task to upload a single file
         * @param  {File} file the file to upload
         * @return {Function} the task function takes a callback as argument
         */
        createStreamTask = function (file) {
            if (file.name) {
                return streamToS3.bind(null, file);
            }
            return function (callback) {
                callback();
            };
        },
        /**
         * create an array of tasks to upload a set of files
         * @param  {Object} inputs hash of name->file/file Array
         * @return {Array} the array of tasks for each input
         */
        createStreamBatch = function (inputs) {
            return Object.keys(inputs).map(function (inputName) {
                if (inputs[inputName] instanceof Array) {
                    return streamFiles.bind(null, inputs[inputName]);
                } else {
                    return createStreamTask(inputs[inputName]);
                }
            });
        },
        streamFiles = function (inputs, callback) {
            if (inputs && Object.keys(inputs).length) {
                if (inputs instanceof Array) {
                    async.parallel(inputs.map(createStreamTask), callback);
                } else if (inputs instanceof Object) {
                    async.parallel(createStreamBatch(inputs), callback);
                }
            } else {
                callback(null, []);
            }
        };
    return function (req, res, next) {
        streamFiles(req.files, function (err, files) {
            req.s3 = {
                files: _.flatten(files)
            };
            next();
        });
    };
};
