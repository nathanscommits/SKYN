const db = require('../db')
const logic = require('../modules/logic')

exports.hudUpdate = function (req, res) {
    let body = req.body
    let response = {}
    response.osay = "";
    response.UUID = body.UUID
    //read database
    db.findOne({UUID: body.UUID}, function(err, ud){

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
            console.log(response)
            res.send(response)
        })
    })
}
