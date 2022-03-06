/*
 * Module dependencies
 */
var express = require('express'),
  stylus = require('stylus'),
  nib = require('nib')

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');
var Person = require('./models/personSchema')
var app = express()
var urlencodedParser = bodyParser.urlencoded({
  extended: true
})

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware({
  src: __dirname + '/public',
  compile: compile
}))
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Home'
  })
})
app.get('/form', (req, res) => {
  res.render('form', {
    title: "Form"
  })
})
app.post('/', urlencodedParser, (req, res) => {
  console.log(req.body);
  res.render('newpage', {
    say: req.body.say,
    to: req.body.to
  });
})
app.get('/addNovel', (req, res) => {
  res.render('person')
})
app.post('/person', urlencodedParser, (req, res) => {
  var personInfo = req.body; //Get the parsed information
  var personInfo = req.body; //Get the parsed information
  console.log("line-55" + req.body);
  if (!personInfo.name || !personInfo.author || !personInfo.pub) {
    res.render('show_message', {
      message: "Sorry, you provided worng info",
      type: "error"
    });
  } else {
    var newPerson = new Person({
      name: personInfo.name,
      author: personInfo.author,
      pub: personInfo.pub
    });

    newPerson.save(function (err, Person) {
      if (err) {
        console.log(err);
        res.render('show_message', {
          message: "Database error",
          type: "error"
        });
      } else
        res.render('show_message', {
          message: "New person added",
          type: "success",
          author: personInfo.author,
          name: personInfo.name,
          pub: personInfo.pub
        });
    });
  }
})
app.get('/showNovel', async (req, res) => {
  var data = await Person.find({});
  console.log(data);
  res.render('showNovel', {
    data: data
  })
})
app.get('/find', urlencodedParser, async (req, res) => {
  var data = await Person.find({});
  console.log(data)
  res.render('data', {
    data: data
  });
})
app.post('/getbyauthor', urlencodedParser, async (req, res) => {

  var data = await Person.find({
    author: req.body.name
  })
  console.log(data)
  res.render('data', {
    data: data
  })
})
app.listen(3000)