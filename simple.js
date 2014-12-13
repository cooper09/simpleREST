
// call the packages we need


var http = require('http'), 
	express = require('express');

// import and set up mongo client

MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
CollectionDriver = require('./collectionDriver').CollectionDriver;

// express routing. 
var app = express();
app.set('port', process.env.PORT || 3000);

// create Mongo instance and collection driver
var mongoHost = 'localHost'; //A
var mongoPort = 27017; 
var collectionDriver;

var mongoClient = new MongoClient(new Server(mongoHost, mongoPort)); //B
mongoClient.open(function(err, mongoClient) { //C
	console.log("motivation...");
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  var db = mongoClient.db("test");  //E
  collectionDriver = new CollectionDriver(db); //F
  console.log("ready for our collection...");
});

app.get('/', function (req, res) {
  res.send('<html><body><h1>Hulk Smash!!!</h1></body></html>');
});
 

// start server 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Simple - Express server listening on port ' + app.get('port'));
});
