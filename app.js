const express = require('express')
//const bodyParser = require('body-parser')'
const mongodb = require('mongodb')
const app = express()
let db
let connectionString = 'mongodb+srv://sharky:L293nShoTQPODgLi@cluster0-xivcd.gcp.mongodb.net/SKYN_HUD?retryWrites=true&w=majority'

let port = process.env.PORT
if(port == null || port == '') {
  port = 3000
}

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
    db = client.db()
    app.listen(port)
})
app.set('views','views')
app.set('view engine', 'ejs')

//const router = require('./router')
//app.use(bodyParser.urlencoded({extended: true})) 
app.use(express.urlencoded({extended: false}))

//app.use(bodyParser.json())

app.post('/endpoint', (req, res) => {
    let bodyData = req.query
    //res.send(bodyData)
    console.log(req);

    if(db.collection('userdata').findOne(UUID: req.query.UUID))
    {
        db.collection('userdata').findOneAndUpdate({UUID: req.query.UUID}, {$set: {
            //UUID: req.query.UUID,
            fitness: req.query.fitness,
            coins: req.query.coins,
            hair: req.query.hair,
            fat: req.query.fat,
            tan: req.query.tan,
            voice: req.query.voice,
            temp: req.query.temp,
            features: req.query.features
        }}, function() {
            res.send("Success")
        })
    }

    else {
        db.collection('userdata').insertOne(req.query, function(){
            res.send(bodyData)
        })
    }

    
})
app.get('/', function (req, res){
    res.send('home page!')
})
app.get('/endpoint', (req, res) => {
    db.collection('userdata').find().toArray(function(err, data){
        res.send(data)
    })
   
   // console.log(res);
})
//{useNewUrlParser: true, useUnifiedTopology: true}
//[21:03] Gayngel: At least with a POST to Google you can also do request.postData.getDataAsString()... There might be some command like that with heroku...

app.use(express.json())
app.use(express.static('public'))



//app.use('/', router)


