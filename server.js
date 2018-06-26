const express = require('express')
const app = express()
var url = require('url');
var bodyParser = require('body-parser');
//var multer = require('multer'); 
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer());
app.set('view engine','ejs');

app.get('/', function (req, res) {
  res.render('index');
})

app.get('/shift', function (req, res) {
  res.render('shift');
})

app.post('/saveFile', function(req, res) {
    var q = url.parse(req.url, true);
	const fs = require('fs');
	var status;
	
var fileName=q.query.year+q.query.month;
console.log(fileName);
console.log(q.query.data);
//var content=req.body;

//var jsonContent = JSON.stringify(content);
//console.log(jsonContent);
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
});

app.listen(8111, function () {
  console.log('Example app listening on port 8111!')
})