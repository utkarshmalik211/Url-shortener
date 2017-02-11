var path = require('path');
var express=require('express')
var mongo = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;
var validUrl = require('valid-url');

var appUrl = "http://localhost:3000/";
var app = express();
var port = process.env.PORT || 8080;
app.set('view engine','pug');
app.set('views',path.join(__dirname+'/views/'));
app.get('/',function(req,res){
	res.render('index');
})

app.get('/new/*',function(req,res){
	var url = req.params[0];
	console.log(url);
	if (validUrl.isUri(url)){
		mongo.connect("mongodb://server:server123@ds149329.mlab.com:49329/urlsh",function(err,db){
			var collection = db.collection('url');
			collection.insert(
				{
		    		actual_url: url
	    		},
	    		function(error,data){
	    			collection.find({actual_url : url},{_id:1,actual_url:1}).toArray(
	    				function(err,result){
	    					console.log(result[0]['_id']);
	    					res.json({actual_url : url,shortened: appUrl+result[0]['_id']})
	    				})	    			
	    		}
    		)
		})
	}else{
		res.send("{invalid url}");
	}
})

app.get('/*',function(req,res){
	var id = req.params[0].toString();
	//res.send(id);
	mongo.connect("mongodb://server:server123@ds149329.mlab.com:49329/urlsh",function(err,db){
			var collection = db.collection('url');
			var objid = "ObjectID("+id+")";
			//new objectID(id);
			collection.find({'_id': objid},{_id:1,actual_url:1}).toArray(function(err,result){
				res.redirect(301,result[0]['actual_url']);
				console.log(result);//['actual_url']);
			})
		});
})
app.listen(port);