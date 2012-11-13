module.exports = function(grunt) {
	'use strict';
	
	var exec = require('child_process').exec;
	
	function isValidType(name,types) {
		var i = types.length,
				ext = name.split('.').pop();
		while (i--)
			if ( types[i] === ext) return true;
		return false;
	};

	function trace(str) {
		console.log(str);
		exec( 'growlnotify -t \'sync images\' -m \''+str+'\'' );
	};
		
	grunt.registerMultiTask('images', 'This deploys escenic images.', function() {
		// var done = this.async(),
		var data = this.data,
				fs = require('fs'),
				ext = this.data.ext,
				force = this.data.force || false,
				message = "";
		
		this.file.src.forEach( function(src) {
			grunt.file.recurse(src, function (abspath, rootdir, subdir, filename) {
				if ( subdir === undefined ) return;
					var target = data.dest + '/' + subdir + '/' + filename,
							sourceTime = 1,
							targetTime = 0;
				
					if (fs.existsSync(target)) {
						sourceTime = fs.lstatSync(abspath).mtime.getTime();
						targetTime = fs.lstatSync(target).mtime.getTime();
					}
				
					if ((force || sourceTime > targetTime) && isValidType(filename,ext)) {
						grunt.file.copy(abspath,target);
						message += 'updated ' + subdir + '/' + filename + '\n';
					}
			});
		})

		if ( message.length ) {
			trace( message );
		}

	});

}


