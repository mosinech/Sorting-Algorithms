var compressor = require('node-minify');

new compressor.minify({
    type: 'gcc',
    fileIn: 'public/keycount.js',
    fileOut: 'public/dist/keycount.min.js',
    callback: function(err, min){
        console.log(err);
    }
});

new compressor.minify({
    type: 'gcc',
    fileIn: 'public/palindrome.js',
    fileOut: 'public/dist/palindrome.min.js',
    callback: function(err, min){
        console.log(err);
    }
});

new compressor.minify({
    type: 'gcc',
    fileIn: 'public/navigator.js',
    fileOut: 'public/dist/navigator.min.js',
    callback: function(err, min){
        console.log(err);
    }
});