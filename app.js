var express = require('express');
var app = express();
var data = require('./data.json');
//Setup Mongo connection
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var option = { useNewUrlParser: true, useUnifiedTopology: true };
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set the view engine to ejs 
app.set('view engine','ejs');

app.get('/',function(req,res){
    res.render('pages/home', { data: data });
});

app.get('/student',function(req,res){
    res.render('pages/student',{ data: data });
});

app.get('/class',function(req,res){
    MongoClient.connect(url, option, function (err, db) {
        if (err) throw err;
        var dbo = db.db("coc");
        var query = {};
        
        dbo.collection("classroom").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.render('pages/class',{classes: result});
            db.close();
        });
    });            
});

app.get('/classdetail/:id',function(req,res){
    var classid = req.params.id;
    // Get the class detail from mongodb
    MongoClient.connect(url, option, function (err, db) {
        if (err) throw err;
        var dbo = db.db("coc");
        var query = {subject_id: classid};
        
        dbo.collection("classroom").findOne(query, function (err, result) {
            if (err) throw err;
            console.log(result);
            res.render('pages/classdetail',{detail: result});
            db.close();
        });
    });    
});

app.get('/classedit/:id',function(req,res){
    var classid = req.params.id;
    // Get the class detail from mongodb
    MongoClient.connect(url, option, function (err, db) {
        if (err) throw err;
        var dbo = db.db("coc");
        var query = {subject_id: classid};
        
        dbo.collection("classroom").findOne(query, function (err, result) {
            if (err) throw err;
            console.log(result);
            res.render('pages/classedit',{detail: result});
            db.close();
        });
    });    
});

app.post('/classsave',function(req,res){
    var id = req.body.id;
    var name = req.body.name;
    var room = req.body.room;
    //Update
    MongoClient.connect(url, option, function (err, db) {
        if(err) throw err;
        var dbo = db.db("coc");
        // select target
        var query = {
            subject_id: id
        }
        // set new values
        var newvalues = { 
            $set: {room: room, subject_name: name} 
        };
        dbo.collection("classroom").updateOne(query, newvalues, function(err, result) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
            res.redirect("/class");
        });
    });   
});
//port ee
app.listen(8080);