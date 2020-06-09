const db = require('../db')
const logic = require('../modules/logic')

exports.hudUpdate = function (req, res) {
    let body = req.body
    let response
    //read ud

    

    console.log(ud)
    //change values
    logic.values(db.findOne({UUID: body.UUID}, function(err, data){
        if(data) return data
    }), body)

    //save ud
    db.findOneAndUpdate({UUID: ud.UUID}, {$set: {
        version: ud.version,
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
            res.send(JSON.stringify(ud))
    })

    
}
