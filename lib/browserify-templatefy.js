const
    path = require('path'),
    templatefy = require('templatefy'),
    ttools = require('browserify-transform-tools'),
    fs = require('fs'),
    util = require('util'),
    through = require('through2'),
    inherify = require('inherify'),
    optiopus = require('optiopus'),
    tpath = path.join(__dirname, 'templates'),
    templates = {
        exports: 'module.exports = %s'
    },
    defaults = optiopus({
        'name': 'templatefy',
        'extension': '.html',
        'paths': []
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
    var pkg = require(b._mdeps.basedir + '/package.json'),
        configuration = pkg['templatefy'] || pkg['browserify-templatefy'],
        templates = [],
        options = b._options.browserField && configuration ? defaults.options(configuration) : defaults.options(opts);

    !~b._extensions.indexOf(options.option('extension')) && b._extensions.push(options.option('extension'));
    !~b._mdeps.paths.indexOf(tpath) && b._mdeps.paths.push(tpath);

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
            done(null, 'module.exports = \'' + filename + '\'');
        });
    }));

    b.transform(ttools.makeRequireTransform("requireTemplatefy", {
        evaluateArguments: false
    }, function(args, opts, done) {
        var name = args[0].replace(/[\u0022\u0027]/g, '');
        if (name === options.option('name'))
            return done(null, 'require(\'templatefy.tmpl\')');
        done();
    }));

    b.pipeline.get('wrap').push(through(function(chunk, enc, done) {
        var self = this,
            data = chunk.toString();
        templatefy.parse({
            'angular.template': false
        }, '<%templatefy%>', function(err, template) {
            self.push(data.replace('(\'TEMPLATEFY-TEMPLATES\')', template.replace('\'<%templatefy%>\'', templates.join('\n'))));
            done();
        });
    }));
}
