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

let currentVersion = "0.8.6"
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
            if(user)
            {
                if(bodyData.coinUpdate == "TRUE")
                {
                    db.collection('userdata').findOneAndUpdate({UUID: bodyData.UUID}, {$set: {
                        version: bodyData.version,
                        name: bodyData.name,
                        coins: bodyData.coins
                    }}, function(err, data) {

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
                else
                {
                    db.collection('userdata').findOneAndUpdate({UUID: bodyData.UUID}, {$set: {
                        //UUID: bodyData.UUID,
                        version: bodyData.version,
                        name: bodyData.name,
                        coins: bodyData.coins,
                        fitness: bodyData.fitness,
                        hair: bodyData.hair,
                        fat: bodyData.fat,
                        tan: bodyData.tan,
                        voice: bodyData.voice,
                        temp: bodyData.temp,
                        features: bodyData.features,
                        timeAlive: bodyData.timeAlive,
                        cItems: bodyData.cItems,
                        cDumbbells: bodyData.cDumbbells,
                        thirst: bodyData.thirst,
                        calories: bodyData.calories,
                        sleep: bodyData.sleep,
                        health: bodyData.health,
                        slotPlays: bodyData.slotPlays,
                        totalSlots: bodyData.totalSlots,
                        totalCoins: bodyData.totalCoins,
                        totalSpent: bodyData.totalSpent,
                        deathCount: bodyData.deathCount
                    }}, function(err, data) {

                        /*let highscores = { coins: -1 }
                        db.collection('userdata').find().sort(highscores).toArray(function (err, result) {
                        if(err) throw err;
                        let leaderboard = Object.assign({}, result)
                        console.log('Name: ', leaderboard[0].name, ' Coins: ', leaderboard[0].coins)
                        console.log('new ranking')
                        }) */

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
app.get('/tutorial', function (req, res){
    res.render('tutorial')
})
app.get('/HUD_guide', function (req, res){
    res.render('HUD_guide')
})
let topten
let toptenta
let toptenf

//coin leaderboard + all others
app.get('/leaderboard', function (req, res){
    let highscores = { coins: -1 }
    let leaderboard = {}
    topten = ''
    db.collection('userdata').find().sort(highscores).collation({locale: "en_US", numericOrdering: true}).toArray(function (err, result) {
        if(err) throw err;
        leaderboard = Object.assign({}, result)
        let rank = 0;
        for (let i in leaderboard)
        {  
            if(rank>9) break; 
             if(leaderboard[i].name != 'Pixel Tyran' && leaderboard[i].name != 'Sharky Piggins')
            {
                rank ++;
                topten = topten.concat('<tr><th>Rank ', rank,'</th><th>', leaderboard[i].name, '</th><th>', parseInt(leaderboard[i].coins), '</th></tr>');  
            }
            
        }
        //console.log(topten);
        //res.render('leaderboard', {data: topten})
    })

    highscores = { timeAlive: -1 }
    leaderboard = {}
    toptenta = ''
    db.collection('userdata').find().sort(highscores).collation({locale: "en_US", numericOrdering: true}).toArray(function (err, result) {
        if(err) throw err;
        leaderboard = Object.assign({}, result)
        let rank = 0;
        for (let i in leaderboard)
        {  
            if(rank>9) break; 
             if(leaderboard[i].name != 'Pixel Tyran' && leaderboard[i].name != 'Sharky Piggins')
            {
                rank ++;
                toptenta = toptenta.concat('<tr><th>Rank ', rank,'</th><th>', leaderboard[i].name, '</th><th>', parseInt(leaderboard[i].timeAlive), '</th></tr>');  
            }
            
        }
        //console.log(topten);
        //res.render('leaderboard', {data: toptenta})
    })

    highscores = { fitness: -1 }
    leaderboard = {}
    toptenf = ''
    db.collection('userdata').find().sort(highscores).collation({locale: "en_US", numericOrdering: true}).toArray(function (err, result) {
        if(err) throw err;
        leaderboard = Object.assign({}, result)
        let rank = 0;
        for (let i in leaderboard)
        {  
            if(rank>9) break; 
             if(leaderboard[i].name != 'Pixel Tyran' && leaderboard[i].name != 'Sharky Piggins')
            {
                rank ++;
                toptenf = toptenf.concat('<tr><th>Rank ', rank,'</th><th>', leaderboard[i].name, '</th><th>', parseInt(leaderboard[i].fitness), '</th></tr>');  
            }
            
        }
        //console.log(topten);
        res.render('leaderboard', {toptenf: toptenf, toptenta: toptenta, data: topten})
    })

    //console.log(JSON.stringify(leaderboard));
    
})

//time alive leaderboard
app.get('/leaderboard-ta', function (req, res){
    let highscores = { timeAlive: -1 }
    let leaderboard = {}
    topten = ''
    db.collection('userdata').find().sort(highscores).collation({locale: "en_US", numericOrdering: true}).toArray(function (err, result) {
        if(err) throw err;
        leaderboard = Object.assign({}, result)
        let rank = 0;
        for (let i in leaderboard)
        {  
            if(rank>9) break; 
             if(leaderboard[i].name != 'Pixel Tyran' && leaderboard[i].name != 'Sharky Piggins')
            {
                rank ++;
                topten = topten.concat('<tr><th>Rank ', rank,'</th><th>', leaderboard[i].name, '</th><th>', parseInt(leaderboard[i].timeAlive), '</th></tr>');  
            }
            
        }
        //console.log(topten);
        res.render('leaderboard-ta', {data: topten})
    })

    //console.log(JSON.stringify(leaderboard));
    
})

//fitness leaderboard
app.get('/leaderboard-f', function (req, res){
    let highscores = { fitness: -1 }
    let leaderboard = {}
    topten = ''
    db.collection('userdata').find().sort(highscores).collation({locale: "en_US", numericOrdering: true}).toArray(function (err, result) {
        if(err) throw err;
        leaderboard = Object.assign({}, result)
        let rank = 0;
        for (let i in leaderboard)
        {  
            if(rank>9) break; 
             if(leaderboard[i].name != 'Pixel Tyran' && leaderboard[i].name != 'Sharky Piggins')
            {
                rank ++;
                topten = topten.concat('<tr><th>Rank ', rank,'</th><th>', leaderboard[i].name, '</th><th>', parseInt(leaderboard[i].fitness), '</th></tr>');  
            }
            
        }
        //console.log(topten);
        res.render('leaderboard-f', {data: topten})
    })

    //console.log(JSON.stringify(leaderboard));
    
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


