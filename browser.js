var cache = require('./cache'),
    templatefy = module.exports = function(options) {
        if (angular && (options.angular || options.angular == 'auto'))
            return angular
                .module(options.name, [])
                .factory('$templateCache', ['$cacheFactory', function($cacheFactory) {
                    return cache;
                }]).name
        return cache;
    }
