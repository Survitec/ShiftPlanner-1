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
app.use(bodyParser.urlencoded({ extended: true })); 
var url = require('url');
var ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(express.static('public'));


app.set('view engine','ejs');

app.get('/', function (req, res) {
  res.render('login');
})

app.get('/index', function (req, res) {
ssn = req.session;
// console.log(ssn);
if(ssn.username){
res.render('index');
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
 //console.log(ssn.username);
 //console.log(req.session.id);
res.render('index');
}
else{
res.render('login');
}
  //res.render('index');
});

app.get('/shift', function (req, res) {
  ssn = req.session; 
   //console.log(ssn);
   //console.log(req.session.id);
  if(ssn.username) {
    res.render('shift');
  } else {
    res.render('login');
  }
 // res.render('shift');
})
app.get('/logout',function(req,res){
 //console.log(ssn.username);
req.session.destroy();
res.render('login');
});

app.post('/saveFile', function(req, res) {
  ssn = req.session; 
  if(ssn.username) {
    var q = url.parse(req.url, true);
	const fs = require('fs');
	var status;
	
var fileName=q.query.year+q.query.month;

fs.writeFile("public/data/"+fileName+".json",q.query.data,{ flag: 'w' }, function (err) {
    if (err) {
	status=err;
    return console.log(err);
    }
	else{
	
	status='File saved successfully';
	}

    console.log("The file was saved!");
}); 
	res.send(status);
	 } else {
    res.render('login');
  }
});

app.listen(8080, ip);
module.exports = app;

//app.listen(8111, function () {
 // console.log('Example app listening on port 8111!')
//})
