var cache = {};
module.exports = {
    put: function(name, value) {
        cache[name] = value;
        return name;
    },
    get: function(name) {
        return cache[name];
    }
}
