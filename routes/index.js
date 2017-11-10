var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;

let db = null;

mongo.connect('mongodb://localhost:27017/things').then(x => db = x);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addthing/:title', function(req, res) {
  db.collection('todos').insert({ title: req.params.title })
    .then(r => res.json(r));
});

router.post('/addthing/', function (req, res) {   
  db.collection('todos').insert(req.body)
    .then(r => res.json(r));
});

router.post('/saveAll/', function (req, res) {   

  let dataToSave = req.body.bodyData;
  dataToSave = dataToSave.map(x => {
    let title = x['title'];
    let num = title.substring(0, title.indexOf('.'));
    x.num = num;
    return x;
  })

  db.collection('todos').insertMany(dataToSave)
    .then(r => res.json(r))
    .catch(r => console.log(r));
  
  //db.collection('todos').insertMany(req.body.bodyData)
  //  .then(r => res.json(r));
  
  
});

router.get('/load/', function (req, res) {
  db.collection('todos').find({}, {_id: 0}).toArray()
    .then(r => res.json(r));
});

module.exports = router;
