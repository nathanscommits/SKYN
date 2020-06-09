const db = require('../db')
const logic = require('../modules/logic')

exports.hudUpdate = function (req, res) {
    let body = req.body
    let response = {}
    response.UUID = body.UUID
    //read ud
    db.findOne({UUID: body.UUID}, function(err, ud){

        logic.values(ud, body, response)

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
            deathCount: ud.deathCount
        }}, function(err, data) {
    
            //send response
            
            response.osay = ud.energy

            console.log(response)
            res.send(response)
        })
    })

    //change values
   

    //save ud
    

    
}
