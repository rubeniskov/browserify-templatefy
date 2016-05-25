const
    browserify = require("browserify"),
    templatefy = require('..');

module.exports = function(expect) {
    
    describe('#browserify', function() {
        var b, contents = '';

        beforeEach(function(done) {
            b = browserify({
                    entries: './test/fixtures/main',
                    paths: ['./test/fixtures'],
                    debug: true
                })
                .plugin(templatefy, {
                    name: 'test-templates'
                });

            b.bundle()
                .on('data', function(data) {
                    contents += data.toString();
                })
                .on('end', done);
        });

        it('should contain all templates included from code', function() {
            expect(contents).to.have.string('<h1></h1>');
            expect(contents).to.have.string('<h2></h2>');
        });
    });
}
