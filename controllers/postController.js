const db = require('../db')
const logic = require('../modules/logic')
const pool = require('../collections/prizes')

const build = "0.10.1"


exports.hudUpdate = function (req, res) {
    let body = req.body
    let response = {}
    response.osay = "";
    response.UUID = body.UUID

    //read database
    db.findOne({UUID: body.UUID}, function(err, ud){
        //update new or old people
        if(ud == null || body.version.substring(0,4)!=build.substring(0,4)) //create new user
        {
            body.version = build
            body.fat = 50
            body.thirst = 50
            body.hunger = 50
            body.sleep = 50
            body.health = 100
            body.pimples = 0
            body.energy = 100
            body.deathCount = 0
            body.sweatSwitch = 0
            body.fatigueSwitch = 0
            body.shape = 0
            body.pimpleStage = 0
            body.sleepSwitch = 0
            body.slapped = 0
            body.slapping = 0
            
            if(ud == null) //new user
            {
                console.log('New User '+body.name+' added.')
                body.voice = 0
                body.coins = 0
                body.fitness = 100
                body.timeAlive = 2
                db.insertOne(body, function(){
                    response.version = body.version
                    response.osay = "Successfully added to the database"
                    console.log("Added in post1 line 46")
                    res.send(response)
                })
                
                return;
            }
            else{ // new hud update
                body.voice = parseFloat(ud.voice)
                body.coins = parseFloat(ud.coins)
                body.fitness = parseFloat(ud.fitness)
                body.timeAlive = parseFloat(ud.timeAlive)
                body.totalCoins = parseFloat(ud.totalCoins)
                db.findOneAndUpdate({UUID: ud.UUID}, {$set: {
                    version: body.version,
                    coins: parseFloat(body.coins),
                    totalCoins: parseFloat(body.totalCoins),
                    fitness: parseFloat(body.fitness),
                    fat: parseFloat(body.fat),
                    timeAlive: parseFloat(body.timeAlive),
                    thirst: parseFloat(body.thirst),
                    hunger: parseFloat(body.hunger),
                    sleep: parseFloat(body.sleep),
                    health: parseFloat(body.health),
                    pimples: parseFloat(body.pimples),
                    energy: parseFloat(body.energy),
                    deathCount: parseFloat(body.deathCount),
                    sweatSwitch: body.sweatSwitch,
                    fatigueSwitch: body.fatigueSwitch,
                    shape: body.shape,
                    pimpleStage: body.pimpleStage,
                    sleepSwitch: body.sleepSwitch,
                    voice: body.voice
                }}, function(err, data) {
                    console.log(body.name+' updated their HUD.')
                    response.version = body.version
                    response.coins = ud.coins
                    response.fitness = ud.fitness   
                    response.fat = ud.fat
                    response.timeAlive = ud.timeAlive
                    response.thirst = ud.thirst
                    response.hunger = ud.hunger
                    response.sleep = ud.sleep
                    response.health = ud.health
                    response.pimples = ud.pimples
                    response.energy = ud.energy
                    response.deathCount = ud.deathCount
                    response.voice = ud.voice
                    response.osay = "New update made."
                    res.send(response)
                   
                })
                return;
            }
        }

        if(body.features.substring(0,1)=="1") //all features on
        {  
            if(body.features.substring(2,3)=="0") //food is off
            {
                ud.hunger+=2;
                ud.thirst+=2;
            }
            if(body.features.substring(3,4)=="0") //sleep is off
            {
                ud.sleep-=2;
            }
            if(body.features.substring(4,5)=="0") //energy is off
            {
                ud.energy+=100;
            }
            //change values
            logic.values(ud, body, response)
            //coin finder
            if(body.features=="11111")
            {
                if(body.coin_find == true)
                {
                    let rand = 100 * Math.random() | 0
                    if(rand<5)
                    {
                        ud.coins += 100
                        response.psay = "You found 100 coins just laying there!"
                    } 
                }
            }            
        }
        if(body.voice == 0) body.voice = ud.voice
        //save values
        let slapped = ud.slapped
        let slapping = ud.slapping
        if(parseInt(body.slapped)!=0) slapped = (ud.slapped+parseInt(body.slapped))
        if(parseInt(body.slapping)!=0) slapping = (ud.slapping+parseInt(body.slapping))
        if(parseFloat(ud.fitness)==NaN) ud.fitness = 100;
        if(parseFloat(ud.fat)==NaN) ud.fat = 50;
        if(parseFloat(ud.timeAlive)==NaN) ud.timeAlive = 2;
        if(parseFloat(ud.thirst)==NaN) ud.thirst = 100;
        if(parseFloat(ud.hunger)==NaN) ud.hunger = 100;
        if(parseFloat(ud.sleep)==NaN) ud.sleep = 0;
        if(parseFloat(ud.health)==NaN) ud.health = 100;
        if(parseFloat(ud.pimples)==NaN) ud.fitness = 0;
        if(parseFloat(ud.deathCount)==NaN) ud.deathCount = 0;
        
        db.findOneAndUpdate({UUID: ud.UUID}, {$set: {
            version: body.version,
            coins: parseFloat(ud.coins),
            fitness: parseFloat(ud.fitness),
            fat: parseFloat(ud.fat),
            timeAlive: parseFloat(ud.timeAlive),
            thirst: parseFloat(ud.thirst),
            hunger: parseFloat(ud.hunger),
            sleep: parseFloat(ud.sleep),
            health: parseFloat(ud.health),
            pimples: parseFloat(ud.pimples),
            energy: parseFloat(ud.energy),
            deathCount: parseFloat(ud.deathCount),
            sweatSwitch: ud.sweatSwitch,
            fatigueSwitch: ud.fatigueSwitch,
            shape: ud.shape,
            pimpleStage: ud.pimpleStage,
            sleepSwitch: ud.sleepSwitch,
            voice: body.voice,
            debug: body.debug,
            features: body.features,
            slapped: slapped,
            slapping: slapping
        }}, function(err, data) {
    
            //send response
            if(body.debug == true)
            {
                //if(ud.energy && ud.hunger && ud.coins && ud.thirst && ud.sleep &&ud.fitness && ud.fat &&ud.pimples &&ud.health)
                response.alert = "Energy: "+parseFloat(ud.energy).toFixed(2)+
                                "\n Fitness: "+parseFloat(ud.fitness).toFixed(2)+
                                "\n Hunger: "+parseFloat(ud.hunger).toFixed(2)+
                                "\n Thirst: "+parseFloat(ud.thirst).toFixed(2)+
                                "\n Sleep: "+parseFloat(ud.sleep).toFixed(2)+
                                "\n Health: "+parseFloat(ud.health).toFixed(2)+
                                "\n Coins: "+parseFloat(ud.coins).toFixed(2)+
                                "\n Fat: "+parseFloat(ud.fat).toFixed(2)+
                                "\n Pimples: "+parseFloat(ud.pimples).toFixed(2)
            
            }
            else response.alert = ""
            response.version = body.version
            response.coins = ud.coins
            response.fitness = ud.fitness   
            response.fat = ud.fat
            response.timeAlive = ud.timeAlive
            response.thirst = ud.thirst
            response.hunger = ud.hunger
            response.sleep = ud.sleep
            response.health = ud.health
            response.pimples = ud.pimples
            response.energy = ud.energy
            response.deathCount = ud.deathCount
            if(body.voice != 0)response.voice = body.voice
            //console.log(response)
            res.send(response)
        })
    })
}

exports.userInfo = function (req, res) {
    db.findOne({UUID: req.body.UUID}, function(err, ud){
        res.send(ud)
    })
}

exports.venderGiver = function (req, res) {
    let body = req.body
    db.findOne({vender: "vender"}, function(err, ud){
        if(ud == null)
        {
            //make new url entry
            db.insertOne(body, function(){
                console.log("added in post1 line 221")
                res.send("new entry and url added")
            })
        }
        else
        {
            // replace url
            db.findOneAndUpdate({vender: "vender"}, {$set: {
                url: body.url,
                vender: "vender"
            }}, function(err, data) {
                res.send("url updated")
            })
        }
    })
}

exports.prizeGen = function (req, res) {
    let rand_num = 100
    let response = {}
    //get avatar and ammount they paid
    response.UUID = req.body.UUID
    let price = req.body.price
    //get random prize key
    let key = rand_num * Math.random() | 0

    if(price == 100)
    {
        if(key<=1) response.key = pool.legendary[pool.legendary.length * Math.random() | 0]
        else if(key<=10) response.key = pool.rare[pool.rare.length * Math.random() | 0]
        else response.key = pool.common[pool.common.length * Math.random() | 0]
    }
    else if(price == 500)
    {
        if(key<=5) response.key = pool.legendary[pool.legendary.length * Math.random() | 0]
        else if(key<=20) response.key = pool.rare[pool.rare.length * Math.random() | 0]
        else response.key = pool.common[pool.common.length * Math.random() | 0]
    }
    else if(price == 5000)
    {
        if(key<=10) response.key = pool.legendary[pool.legendary.length * Math.random() | 0]
        else response.key = pool.rare[pool.rare.length * Math.random() | 0]
    }
    
    response.price = price

    db.findOne({UUID: req.body.UUID}, function(err, ud){ // find users exist and get coin balance
        if(err)
        {
            response.error = "You need a SKYN HUD for that."
            res.send(response)
        }
        else if((ud.values.coins - price) >= 0) // CHECK THEY HAVE ENOUGH MONEY
        {
            if(ud.version != "0.12") // check they have right hud update
            {
                response.error =  "You need to update your HUD first."
                res.send(response)
                return;
            }
            //take users money
            db.findOneAndUpdate({UUID: req.body.UUID}, {$set: {
                "values.coins": (ud.values.coins - price)
            }}, function(err, data) {
                db.findOne({vender: "vender"}, function(err, ud){
                    if(err)
                    {
                        response.error = "error"
                        res.send(response)
                    }
                    else
                    {
                        response.url = ud.url
                        res.send(response)
                    }
                })
            })
        }
        else
        {
            response.error = "Insufficient balance."
            res.send(response)
        }
    })
    //see if avatar wants it
    
}

exports.refund = function(req, res) {
    //refund 50% of price
    if(req.body.refund != "TRUE") return;
    let i = (req.body.price/2)
    db.findOne({UUID: req.body.UUID}, function(err, ud){ // find users exist and get coin balance
        if(err)
        {
            res.send("Something went wrong")
        }
        else
        {
            db.findOneAndUpdate({UUID: req.body.UUID}, {$set: {
                "values.coins": (ud.coins + i)
            }}, function(err, data) {
                res.send("Coins refunded.")
            })
        }
    })
}


exports.savePrize = function(req, res) {
    //refund 50% of price
    db.findOneAndUpdate({UUID: req.body.UUID}, {$push: {
        prizeName: req.body.prize
    }}, function(err, data) {
            if(err) res.send("Error on prize saver")
            else res.send("Saved to the database")
    })
}

	
