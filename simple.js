
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

/*  cooper s - for simple get testing
	
app.get('/', function (req, res) {
  res.send('<html><body><h1>Hulk Smash!!!</h1></body></html>');
});
 */

//set up Gets for each collection
app.get('/:collection', function(req, res) { //A
console.log("ta-da!!!", req.params);
   var params = req.params; //B
   collectionDriver.findAll(req.params.collection, function(error, objs) { //C
   		console.log("find all: ", req.params.collection);
    	  if (error) { res.send(400, error); } //D
	      else { 
	          if (req.accepts('html')) { //E
	          	console.log("receive collection objects: ");
    	          res.render('data',{objects: objs, collection: req.params.collection}); //F
              } else {
	          res.set('Content-Type','application/json'); //G
                  res.send(200, objs); //H
              }
         }
   	});
});

app.get('/:collection/:entity', function(req, res) { //I
   var params = req.params;
   var entity = params.entity;
   var collection = params.collection;
   if (entity) {
       collectionDriver.get(collection, entity, function(error, objs) { //J
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //K
       });
   } else {
      res.send(400, {error: 'bad url', url: req.url});
   }
});

// start server 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Simple - Express server listening on port ' + app.get('port'));
});
