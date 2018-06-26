const express = require('express')
const app = express()
var url = require('url');
var ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(express.static('public'));


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

app.listen(8080, ip);
module.exports = app;

//app.listen(8111, function () {
  //console.log('Example app listening on port 8111!')
//})