var path = require('path'),
    tools = require('browserify-transform-tools'),
    templatefy = require('templatefy'),
    pkg = require('./package.json'),
    extensions = ['.htm', '.html', '.twig', '.jade'],
    extregexp = new RegExp(extensions.join('|') + '$'),
    escape = function(content) {
        return content
            .replace(/\\/g, '\\\\')
            .replace(/\n+$/, '')
            .replace(/'/g, '\\\'')
            .replace(/\r?\n/g, '\\n\' +\n    \'');
    };

module.exports = function(file, opts) {
    return (extregexp.test(file) ?
        tools.makeStringTransform(pkg.name, {
            includeExtensions: ['.htm', '.html', '.twig', '.jade'],
            evaluateArguments: true
        }, function(content, options, done) {
            content = "'" + escape(content) + "'"
            done(null, 'module.exports = require(\'browserify-templatefy/cache\').put(\'' + options.file + '\',' + content + ')');
        }) :
        tools.makeRequireTransform(pkg.name, {
            evaluateArguments: true
        }, function(args, options, done) {
            if (args[0] === (options.config.name ||  pkg.name) || args[0] === 'templatefy')
                return done(null, 'require(\'browserify-templatefy\')(' + JSON.stringify({
                    name: options.config.name,
                    angular: options.config.angular || 'auto'
                }) + ')');

            done();
        }))(file, opts);
}
