const express = require('express');
const app = express();
const session = require('express-session');
var half_hour = 1800000;
var ssn;
app.use(session({
    secret: "jkYO7^8S4@#5D4g5vfdf-2$3gr2%34",
    resave: false,
    saveUninitialized: true,
	cookie  : { maxAge  : half_hour}
}));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
var url = require('url');
var ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(express.static('public'));


app.set('view engine','ejs');

app.get('/', function (req, res) {
  res.render('login');
})

app.get('/weekly-highlights', function (req, res) {
  ssn = req.session;

if(ssn.username){
res.render('weekly');
}
else{
res.render('login');
}
})

app.get('/view-weekly', function (req, res) {
  ssn = req.session;

if(ssn.username){
res.render('view-weekly');
}
else{
res.render('login');
}
})

app.get('/index', function (req, res) {
ssn = req.session;

if(ssn.username){
res.render('index');
}
else{
res.render('login');
}
  
})

app.get('/news', function (req, res) {
ssn = req.session;

if(ssn.username){
res.render('news');
}
else{
res.render('login');
}
  
})
app.post('/action',function(req,res){
  ssn = req.session;
 
  var username=req.body.username;
  var password=req.body.password;
if(username=='Tecshplan'&& password=='TM$node%sp^123'){
 ssn.username=req.body.username;

res.render('index');
}
else{
res.render('login');
}
  //res.render('index');
});

app.get('/shift', function (req, res) {
  ssn = req.session; 

  if(ssn.username) {
    res.render('shift');
  } else {
    res.render('login');
  }
 // res.render('shift');
})
app.get('/logout',function(req,res){

req.session.destroy();
res.render('login');
});

app.post('/saveFile', function(req, res) {
  ssn = req.session; 
//var json=req.body;
var content = JSON.stringify(req.body);
 
  if(ssn.username) {
    var q = url.parse(req.url, true);
	const fs = require('fs');
	var status;
	//console.log(content);
var fileName=q.query.year+q.query.month;
var flag=q.query.flag;
if(flag=='weekly'){
content=content.replace(/[\[\]']+/g,'');
fs.writeFile("public/data/weekly_highlights/"+fileName+".json",content+',',{ flag: 'w' }, function (err) {
    if (err) {
	status=err;
    }
	else{
	
	status='File saved successfully';
	}
}); 
}
else{

fs.writeFile("public/data/"+fileName+".json",content,{ flag: 'w' }, function (err) {
    if (err) {
	status=err;
    }
	else{
	
	status='File saved successfully';
	}

}); 
}
	res.send({"status":status});
	 } else {
    res.render('login');
  }
});

app.get('/getData', function(req, res) {
  ssn = req.session; 
//var json=req.body;
const content = JSON.stringify(req.body);
  if(ssn.username) {
    var q = url.parse(req.url, true);
	const fs = require('fs');
	var status;
	//console.log(content);
var fileName=q.query.year+q.query.month;
var flag=q.query.flag;

if(flag=='weekly'){
fs.readFile("public/data/weekly_highlights/"+fileName+".json", 'utf8', function (err, data) {
    if (err) {
	status=err;
	res.send({"status":status});
    }
	else{
	   
		if(data.endsWith("},")){
		data = data.substring(0, data.length - 1);
		
		}

  res.send('['+data+']');
	}
 
});
}
else{

fs.readFile("public/data/news/news.json", 'utf8', function (err, data) {
    if (err) {
	status=err;
	res.send({"status":status});
    }
	else{
	   
		if(data.endsWith("},")){
		data = data.substring(0, data.length - 1);
		
		}

  res.send('['+data+']');
	}
 
});
}
	
	 } else {
    res.render('login');
  }
});


app.post('/edit-news', function(req, res) {

  ssn = req.session; 

//var json=req.body;

  if(ssn.username) {
      var password=req.body.pwd;
if(password=='TM$neWs%N33^123'){

  var content = req.body.data;
 content=content.replace(/[\[\]']+/g,'');
 if (content === "") {
    content="";
}
else{
content=content+',';
}
    var q = url.parse(req.url, true);
	const fs = require('fs');
	var status;

fs.writeFile("public/data/news/news.json",content,{ flag: 'w' }, function (err) {
    if (err) {
	status=err;
    }
	else{
	
	status='File saved successfully';
	}
}); 
	res.send('File saved successfully');
	 }

else{
status='Sorry, wrong password, one more chance... Try Again !!!';
res.send(status);
}	
} else {
    res.render('login');
  }
});


app.post('/saveWeekFile', function(req, res) {
  ssn = req.session; 
//var json=req.body;
const content = JSON.stringify(req.body);
  if(ssn.username) {
    var q = url.parse(req.url, true);
	const fs = require('fs');
	var status;
	//console.log(content);
var fileName=q.query.year+q.query.month;


fs.writeFile("public/data/weekly_highlights/"+fileName+".json",content+',',{ flag: 'a' }, function (err) {
    if (err) {
	status=err;
    }
	else{
	
	status='File saved successfully';
	}

}); 
	res.send({"status":status});
	 } else {
    res.render('login');
  }
});

app.listen(8080, ip);
module.exports = app;

//app.listen(8111, function () {
 // console.log('Example app listening on port 8111!')
//})