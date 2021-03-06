var http = require('http');
var path = require('path');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

//var entries = [];

//app.locals.entries = entries;

app.use(logger("dev"));

app.use(bodyParser.urlencoded({extended:false}));

app.get("/", function(request, response){
	MongoClient.connect(url, function(err, db){
		if(err) throw err;
		var dbObj = db.db("games");

		dbObj.collection("games").find().toArray(function(err, results){
			console.log("Site Served");
			db.close();
			response.render("index", {games:results});
		});
	});
});

app.get("/new-entry", function(request, response){
	response.render("new-entry");
});

app.post("/new-entry", function(request, response){
	if(!request.body.title || !request.body.body){
		response.status(400).send("Entries must have some text");
		return;
	}
	
	MongoClient.connect(url, function(err, db){
		if(err) throw err;

		var dbObj = db.db("games");

		dbObj.collection("games").save(request.body, function(err, result){
			console.log("data saved");
			db.close();
			response.redirect("/");
		});
	});
	/*entries.push({
		title:request.body.title,
		body:request.body.body,
		published:new Date()
	});*/
	//response.redirect("/");
});

app.use(function(request, response){
	response.status(404).render("404");
});

http.createServer(app).listen(3000, function(){
	console.log("Game library server started on port 3000");
});