/*
  Author: George Zhao

  A very basic node server application
*/
var express = require('express')
  , logger = require('morgan')
  , app = module.exports = express()
  , server = require('http').createServer(app);

// map .renderFile to ".html" files
app.engine('html', require('ejs').renderFile);

// make ".html" the default
app.set('view engine', 'html');


app.use(express.logger());

// serve static files
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
  res.render("index");
})
app.get("/keycount", function(req, res){
  res.render("KeyCount");
})
app.get("/palindrome", function(req, res){
  res.render("Palindrome");
})

// assume "not found" in the error msgs
// is a 404. this is somewhat silly, but
// valid, you can do whatever you like, set
// properties, use instanceof etc.
app.use(function(err, req, res, next){
  // treat as 404
  if (~err.message.indexOf('not found')) return next();

  // log it
  console.error(err.stack);

  // error page
  res.status(500).render('5xx');
});

// assume 404 since no middleware responded
app.use(function(req, res, next){
  res.status(404).render('404', { url: req.originalUrl });
});

if (!module.parent) {
  server.listen(5888);
  console.log('\n  listening on port 5888\n');
}