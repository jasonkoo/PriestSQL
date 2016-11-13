var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var requirejsOptimize = require('gulp-requirejs-optimize');
var gulpSequence = require('gulp-sequence');

var fs = require('fs'),
    stat = fs.stat;

var compressor = require('yuicompressor');
var UglifyJS = require("uglify-js");

var compressJS_Re = function( src, sources ){
    fs.readdir( src, function( err, paths ){
        if( err ){
            throw err;
        }
        paths.forEach(function( path ){
             var _src = src + '/' + path,
                _dst = src.split('/sources')[0] + '/' + path.split('.')[0] + '.min.js',
                readable, 
                writable;       
            stat( _src, function( err, st ){
                if( err ){
                    throw err;
                }
                if( st.isFile() && sources){
                	if(_dst.indexOf('.js') > 0 && (_dst.indexOf('.js') + 3) == _dst.length){
	                    readable = fs.createReadStream( _src );
	                    writable = fs.createWriteStream( _dst );   
	                    readable.pipe( writable );
	                    writable.on('finish', function(){
	                    	// var result = UglifyJS.minify(_dst,{outSourceMap: path + '.map'});
	                        console.log('正在压缩js：' + _dst)
	                    	var result = UglifyJS.minify(_dst);
	                    	fs.writeFile(_dst, result.code, function(e){
							    if(e) throw e;
							})
	                    	
							// fs.writeFile(_dst + '.map', result.map, function(e){
							//     if(e) throw e;
							// })
	                    });
                	}
				}
                else if( st.isDirectory()){
                	if(_src.indexOf('sources') >= 0){
                		
                		compressJS_Re(_src, true);
                	}else{
                		compressJS_Re(_src);
                	}
                }
            });
        });
    });
};

var compressCSS_Re = function( src, sources ){
    fs.readdir( src, function( err, paths ){
        if( err ){
            throw err;
        }
        paths.forEach(function( path ){
            var _src = src + '/' + path,
                _dst = src.split('/sources')[0] + '/' + path.split('.')[0] + '.min.css',
                readable, 
                writable;

            stat( _src, function( err, st ){
                if( err ){
                    throw err;
                }
                if( st.isFile() && sources){
                	if(_dst.indexOf('.css') > 0 && (_dst.indexOf('.css') + 4) == _dst.length){
	                    readable = fs.createReadStream( _src );
	                    writable = fs.createWriteStream( _dst );   
	                    readable.pipe( writable );
	                    writable.on('finish', function(){
	                    	console.log('正在压缩css：' + _dst)
	                    	compressor.compress(_dst, {
							    //Compressor Options:
							    charset: 'utf8',
							    type: 'css',
							    nomunge: true,
							    'line-break': 80
							}, function(err, data, extra) {
							    fs.writeFile(_dst, data, function(e){
								    if(e) throw e;
								})
							});
	                    });
                	}
                }
                else if( st.isDirectory()){
                	if(_src.indexOf('sources') >= 0){
                		compressCSS_Re(_src, true);
                	}else{
                		compressCSS_Re(_src);
                	}
                }
            });
        });
    });
};
gulp.task('default', function() {
	compressJS_Re('../js');
	compressCSS_Re('../css');
});
gulp.task('compress', function() {
	compressJS_Re('../js');
	compressCSS_Re('../css');
});
