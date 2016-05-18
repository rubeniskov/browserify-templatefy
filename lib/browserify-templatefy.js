const
    path = require('path'),
    templatefy = require('templatefy'),
    ttools = require('browserify-transform-tools'),
    fs = require('fs'),
    util = require('util'),
    through = require('through2'),
    inherify = require('inherify'),
    optiopus = require('optiopus'),
    // applySourcemaps = require('vinyl-sourcemaps-apply'),
    templates = {
        exports: 'module.exports = %s'
    },
    defaults = optiopus({
        'name': 'templatefy'
    }),
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

    var templates = [],
        options = defaults.options(opts);

    b._mdeps.paths.push(path.join(__dirname, 'templates'));

    b.transform(ttools.makeStringTransform("templatefy", {
        includeExtensions: [".html"]
    }, function(content, opts, done) {
        var filename = path.relative(process.cwd(), opts.file);
        if (!opts.config)
            return done(new BrowserifyTemplatefyError("Could not find templatefy configuration."));

        templatefy.parse(options.option({
            'angular.module': false,
            'angular.template.name': filename
        }).options, content, function(err, template) {
            templates.push(template);
            done(null, 'require(\'templatefy.tmpl\')\nmodule.exports = \'' + filename + '\'');
        });
    }));

    b.transform(ttools.makeRequireTransform("requireTemplatefy", {
        evaluateArguments: false
    }, function(args, opts, done) {
        var name = args[0].replace(/[\u0022\u0027]/g, '');
        if (name === options.option('name')) {
            return done(null, 'require(\'templatefy.tmpl\')');
        } else if (name === 'templatefy') {
            templatefy.parse({
                'angular.template': false
            }, '<%templatefy%>', function(err, template) {
                done(null, template + '\nmodule.exports = \'templatefy\'');
            });
        } else {
            done();
        }
    }));

    b.pipeline.get('wrap').push(through(function(chunk, enc, done) {
        this.push(chunk.toString().replace('\'<%templatefy%>\'', templates.join('\n')));
        done();
    }));
}
