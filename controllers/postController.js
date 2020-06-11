const db = require('../db')
const logic = require('../modules/logic')

exports.hudUpdate = function (req, res) {
    let body = req.body
    let response = {}
    response.osay = "";
    response.UUID = body.UUID
    //read database
    db.findOne({UUID: body.UUID}, function(err, ud){

        if(ud == null || body.version!='0.10.0') //create new user
        {
            body.version = '0.10.0'
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

            if(ud == null) //new user
            {
                console.log('New User '+body.name+' added.')
                body.coins = 0
                body.fitness = 100
                body.timeAlive = 2
                db.insertOne(body, function(){
                    response.version = body.version
                    response.osay = "Successfully added to the database"
                    res.send(response)
                })
                
                return;
            }
            else{ // new hud update
                body.coins = parseInt(ud.coins)
                body.fitness = parseInt(ud.fitness)
                body.timeAlive = parseInt(ud.timeAlive)
                body.totalCoins = parseInt(ud.totalCoins)
                db.findOneAndUpdate({UUID: ud.UUID}, {$set: {
                    version: body.version,
                    coins: body.coins,
                    totalCoins: body.totalCoins,
                    fitness: body.fitness,
                    fat: body.fat,
                    timeAlive: body.timeAlive,
                    thirst: body.thirst,
                    hunger: body.hunger,
                    sleep: body.sleep,
                    health: body.health,
                    pimples: body.pimples,
                    energy: body.energy,
                    deathCount: body.deathCount,
                    sweatSwitch: body.sweatSwitch,
                    fatigueSwitch: body.fatigueSwitch,
                    shape: body.shape,
                    pimpleStage: body.pimpleStage,
                    sleepSwitch: body.sleepSwitch
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
                    response.osay = "New update made."
                    res.send(response)
                   
                })
                return;
            }
        }
        //change values
        logic.values(ud, body, response)

        //save values
        db.findOneAndUpdate({UUID: ud.UUID}, {$set: {
            version: body.version,
            coins: ud.coins,
            fitness: ud.fitness,
            fat: ud.fat,
            timeAlive: ud.timeAlive,
            thirst: ud.thirst,
            hunger: ud.hunger,
            sleep: ud.sleep,
            health: ud.health,
            pimples: ud.pimples,
            energy: ud.energy,
            deathCount: ud.deathCount,
            sweatSwitch: ud.sweatSwitch,
            fatigueSwitch: ud.fatigueSwitch,
            shape: ud.shape,
            pimpleStage: ud.pimpleStage,
            sleepSwitch: ud.sleepSwitch
        }}, function(err, data) {
    
            //send response
            response.alert = "Energy: "+ud.energy+"\n Fitness: "+ud.fitness+"\n Hunger: "+ud.hunger+"\n Thirst: "+ud.thirst+"\n Sleep: "+ud.sleep+"\n Health: "+ud.health+"\n Coins: "+ud.coins+"\n Fat: "+ud.fat+"\n Pimples: "+ud.pimples
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
