const
    path = require('path'),
    templatefy = require('templatefy'),
    ttools = require('browserify-transform-tools'),
    fs = require('fs'),
    util = require('util'),
    inherify = require('inherify'),

    BrowserifyTemplatefyError = inherify(Error, {
        __constructor: function(settings) {
            settings = typeof(settings) === 'string' ? {
                message: settings
            } : settings || {};
            this.name = 'BrowserifyTemplatefyError';
            this.type = settings.type || 'Application';
            this.message = settings.message || 'An error occurred.';
            this.detail = settings.detail || '';
            this.extendedInfo = settings.extendedInfo || '';
            this.errorCode = settings.errorCode || '';
            Error.captureStackTrace(this, BrowserifyTemplatefyError);
        }
    });

module.exports = function(b, opts) {
    //b._mdeps.paths.push(path.join(__dirname, 'templates'));

    b.transform(ttools.makeStringTransform("templatefy", {
        includeExtensions: [".html"]
    }, function(content, opts, done) {

        if (!opts.config)
            return done(new BrowserifyTemplatefyError("Could not find unbluify configuration."));

            templatefy.parse(content, function(err, template){
                done(null, 'template');
            });
    }));
}
