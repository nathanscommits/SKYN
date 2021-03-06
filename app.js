const express = require('express')
const app = express()
const db = require('./db')
const router = require('./router')

app.set('views','views')
app.set('view engine', 'ejs')

//json parsers
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//gets
app.use("/", router)

let currentVersion = "0.9.1"
let sendstring 

//recieve old POST requests
app.post('/jShf8Sh37dSb3', (req, res) => {
    console.log(req.body);
    let bodyData = req.body
    //res.send(bodyData)
   if(bodyData.update=="TRUE")
   {
        db.findOne({UUID: bodyData.UUID}, function(err, data){
            if(data)
            {
                res.send(JSON.stringify(data))
            }
        })
   }
    //update
    else{
        db.findOne({UUID: bodyData.UUID}, function(err, user)
        {
            if(user)
            {
                if(bodyData.coinUpdate == "TRUE" && bodyData.version == currentVersion)
                {
                    db.findOneAndUpdate({UUID: bodyData.UUID}, {$set: {
                        version: bodyData.version,
                        name: bodyData.name,
                        coins: bodyData.coins
                    }}, function(err, data) {

                        if(user.version!=currentVersion)
                        {
                            res.send("New update made")
                        }
                        else
                        {
                            res.send("New update made")
                        }
                    })
                }
                else if(bodyData.prizeUpdate == "TRUE")
                {
                    db.findOneAndUpdate({UUID: bodyData.UUID}, {$push: {
                        prizeName: bodyData.prizeName
                    }}, function(err, data) {
                        if(user.version!=currentVersion)
                        {
                            res.send("New update made")
                        }
                        else
                        {
                            res.send("New update made")
                        }
                    })
                }
                else
                { 
                    if(bodyData.version==currentVersion)
                    {
                        db.findOneAndUpdate({UUID: bodyData.UUID}, {$set: {
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
                            db.find().sort(highscores).toArray(function (err, result) {
                            if(err) throw err;
                            let leaderboard = Object.assign({}, result)
                            console.log('Name: ', leaderboard[0].name, ' Coins: ', leaderboard[0].coins)
                            console.log('new ranking')
                            }) */
  
                            if(user.version!=currentVersion)
                            {
                                //res.send("New update available")
                                db.findOne({UUID: bodyData.UUID}, function(err, data){
                                    if(data)
                                    {
                                        sendstring = data.UUID + "New Update Available" + currentVersion
                                        res.send(sendstring) //data.UUID,"New Update Available",currentVersion
                                    }
                                })
                            }
                            else
                            {
                                res.send("New update made")
                            }
                        })
                    }
                   // res.send("Wrong version")
                    else console.log("Wrong version caught")
                }
            }
            else{
                //new entry
                db.insertOne(bodyData, function(){
                    console.log("new entry from app line 134")
                    res.send("New user added")
                })
            }
        })
    }
     
})

app.use(express.static('public'))

module.exports = app