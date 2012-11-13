/*global module:false*/
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		meta: {
			version: '0.1.0',
			banner: '/*! v<%= meta.version %> - ' +
							'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
							'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
							'Alexander Aivars Kramgo AB; Licensed MIT */'
		},
		sass: {
			main: {
				options: {
					source: 'source/sass',
					output: 'public/css',
					force: false
				}
			}
		},
		coffee: {
			source: {
				options: {
					bare: false
				},
				files: {
					'public/js/*.js': ['source/coffeescript/**/*.coffee']
				}
			},
			spec: {
				options: {
					bare: true
				},
				files: {
					'specs/javascript/*.js': ['specs/coffeescript/**/*.coffee']
				}
			}
		},
		lint: {
			files: ['grunt.js', 'source/**/*!(min).js']
		}, 
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: false,
				eqnull: true,
				browser: true,
				camelcase: true,
				unused: true,
				trailing: true
			},
			globals: {
				jQuery: true
			}
		},
		jasmine : {
			src : 'src/**/*.js',
			specs : ['specs/**/*_spec.js'],
			helpers : 'specs/helpers/*.js'
		},		
		watch: {
			code: {
				files: 'src/**/*.coffee',
				tasks: 'coffee:source'
			},
			styles: {
				files: 'src/**/*.scss',
				tasks: 'sass'
			},
			tests: {
				files: ['specs/**/*.coffee','<config:lint.files>'],
				tasks: 'coffee:spec jasmine lint'
			}
		}
	});

	// Load Tasks
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-jasmine-runner');
	grunt.loadTasks('tasks');
	
	// Default task.
	grunt.registerTask('build','sass coffee jasmine lint');

};