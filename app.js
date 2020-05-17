const express = require('express')
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

//json parsers
app.use(express.urlencoded({extended: true}))
app.use(express.json())

let currentVersion = "0.7.4"
//recieve POST requests
app.post('/jShf8Sh37dSb3', (req, res) => {
    console.log(req.body);
    let bodyData = req.body
    //res.send(bodyData)
   if(bodyData.update=="TRUE")
   {
        db.collection('userdata').findOne({UUID: bodyData.UUID}, function(err, data){
            if(data)
            {
                res.send(JSON.stringify(data))
            }
        })
   }
    //update
    else{
        db.collection('userdata').findOne({UUID: bodyData.UUID}, function(err, user)
        {
                console.log(user);
            if(user)
            {
                db.collection('userdata').findOneAndUpdate({UUID: bodyData.UUID}, {$set: {
                    //UUID: bodyData.UUID,
                    version: bodyData.version,
                    name: bodyData.name,
                    fitness: bodyData.fitness,
                    coins: bodyData.coins,
                    hair: bodyData.hair,
                    fat: bodyData.fat,
                    tan: bodyData.tan,
                    voice: bodyData.voice,
                    temp: bodyData.temp,
                    features: bodyData.features,
                    timeAlive: bodyData.timeAlive,
                    cItems: bodyData.cItems,
                    cDumbbells: bodyData.cDumbbells,
                    hunger: bodyData.hunger,
                    thirst: bodyData.thirst,
                    calories: bodyData.calories,
                    sleep: bodyData.sleep,
                    health: bodyData.health
                }}, function(err, data) {

                    let highscores = { coins: -1 }
                    db.collection('userdata').find().sort(highscores).toArray(function (err, result) {
                       if(err) throw err;
                       console.log(result.find('name'), result.find('coins'))
                    })

                    if(user.version!=currentVersion)
                    {
                        res.send("New update available")
                    }
                    else
                    {
                        res.send("New update made")
                    }
                })
            }
            else{
                //new entry
                db.collection('userdata').insertOne(bodyData, function(){
                    res.send("New user added")
                })
            }
        })
    }
     
})
app.get('/', function (req, res){
    res.render('home-guest')
})
app.get('/HUD_guide', function (req, res){
    res.render('HUD_guide')
})
app.get('/jShf8Sh37dSb3', (req, res) => {
    db.collection('userdata').find().toArray(function(err, data){
        res.send(JSON.stringify(data))
    })
   
   // console.log(res);
})
//{useNewUrlParser: true, useUnifiedTopology: true}
//[21:03] Gayngel: At least with a POST to Google you can also do request.postData.getDataAsString()... There might be some command like that with heroku...


app.use(express.static('public'))



//app.use('/', router)


