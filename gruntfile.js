'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        coveralls: {
            options: {
                force: false
            },

            your_target: {
                src: 'lcovonly',
            },
        },
    });

    grunt.loadNpmTasks('grunt-coveralls');
}