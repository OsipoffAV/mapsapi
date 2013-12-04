// Main CLI 2GIS Maps API 2.0
// See tasks list: grunt

var build = require('./build/build.js'),
    test = require('./test/test.js'),
    gendoc = require('./docbuilder/gendoc.js'),
    config = require('./build/config.js').config;

module.exports = function (grunt) {
    'use strict';

    // grunt.registerTask('githooks', ['githooks']);

    grunt.registerTask('buildSrc', function () {
        build.buildSrc();
    });

    grunt.registerTask('setVersion', function () {
        var done = this.async();

        build.setVersion(done);
    });

    // Copy all assets
    grunt.registerTask('assets', ['copy']);

    // Check JS files for errors with JSHint
    grunt.registerTask('hint', ['jshint:force']);

    // Lint, combine and minify source files, copy assets
    grunt.registerTask('build', ['hint', 'assets', 'buildSrc', 'githooks']);

    // Generate documentation from source files
    grunt.registerTask('doc', function () {
        var doc = grunt.config.get('doc');
        gendoc.generateDocumentation(doc.menu, doc.input, doc.output);
    });

    // Rebuild and run unit tests
    grunt.registerTask('test', function () {
        build.buildSrc(false);
        grunt.task.run('karma:continuous');
    });

    // Set version API in loader.js, copy all assets
    grunt.registerTask('release', ['setVersion', 'assets']);

    // Default task
    grunt.registerTask('default', function () {
        grunt.log.writeln('\nTasks list:\n');
        grunt.log.writeln('grunt assets      # Copy all assets to public/');
        grunt.log.writeln('grunt hint        # Check JS files for errors with JSHint');
        grunt.log.writeln('grunt build       # Lint, combine and minify source files, copy assets');
        grunt.log.writeln('grunt doc         # Generate documentation from .md files');
        grunt.log.writeln('grunt test        # Rebuild source and run unit tests');
        grunt.log.writeln('grunt release     # Preparation for release (set version stat files and copy assets)');
    });

    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: [config.img.pattern], dest: config.img.dest, filter: 'isFile'}, //dg images
                    {expand: true, flatten: true, src: [config.img.patternLeaflet], dest: config.img.destLeaflet, filter: 'isFile'}, //leaflet images
                    {expand: true, flatten: true, src: [config.font.pattern], dest: config.font.dest, filter: 'isFile'}, //dg fonts
                    {expand: true, flatten: true, src: [config.svg.pattern], dest: config.svg.dest, filter: 'isFile'} //dg svg
                ]
            }
        },
        jshint: {
            force: {
                options: {
                    jshintrc: true,
                    force: true
                },
                src: ['src/*/src/**/*.js']
            },
            hook: {
                options: {
                    jshintrc: true
                },
                src: ['src/*/src/**/*.js']
            }
        },
        githooks: {
            all: {
                // Will run the jshint and test:unit tasks at every push
                options: {
                    template: 'hooks/pre-push.js'
                },
                'pre-push': 'test'
            }
        },
        karma: {
            options: {
                configFile: 'test/karma.conf.js',
                browsers: test.getBrowsers(),
                reporters: test.getReporters(),
                junitReporter: test.getJunitReporter()
            },
            continuous: {
                singleRun: true
            },
            dev: {
            }
        },
        doc: {
            menu: './src/menu.json',
            input: './src/',
            output: './public/doc'
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-contrib-copy');
};
