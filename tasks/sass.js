module.exports = function(grunt) {
	'use strict';
	// TODO: ditch this when grunt v0.4 is released
	// grunt.util = grunt.util || grunt.utils;
	grunt.registerMultiTask('sass', 'This triggers the `sass compile` command.', function() {
		
		var path = require('path'),
				fs = require('fs'),
				exec = require('child_process').exec,
				done = this.async(),
				data = this.data,
		 		command = "sass --update",
				source = this.data.input,	
				options = this.data.options,	
				libs;

		if (options.force === true) {
			command += ' --force';
		}
		
		if (options.source !== undefined) {
			source = options.source + '/**/*.scss';
		}
		
		if (options.lib !== undefined) {
			libs = options.lib + '/**/*.scss';
		}
			
		grunt.file.expandFiles(source).forEach(function(filepath) {
			if( path.basename(filepath).charAt(0) != '_' ) {
				command += ' ' + filepath;	
				if (options.output !== undefined && fs.statSync(options.output).isDirectory()) {
					var subpath = path.dirname(filepath).replace(options.source,'');
					command += ':' + options.output + subpath + '/' + path.basename(filepath).replace('.scss','.css');
				}
			}
		});
		
		if (libs !== undefined) {		
			grunt.file.expandFiles(libs).forEach(function(filepath) {
				if( path.basename(filepath).charAt(0) != '_' ) {
					command += ' ' + filepath + ':/dev/null';	
				}
			});
		}
			
		exec( command, puts );
		
		function puts( error, stdout, stderr ) {
			grunt.log.write( '\n\nSASS output:' );
			grunt.log.write( stdout );
			if (error !== null) {
				grunt.helper('growl', 'SASS error', error);
				grunt.log.error( error );
				done(false);
			} else {
				grunt.helper('growl', 'SASS', stdout);
				done(true);
			}
		}
		
	});

 	// growl: Ex. grunt.helper('growl', 'foo', 'bar');
  // http://growl.info/extras.php#growlnotify
  grunt.registerHelper('growl', function(title, msg) {
		var exec = require('child_process').exec;
		exec( 'growlnotify -t \''+title+'\' -m \''+msg+'\'' );
  });

};
