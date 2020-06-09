const db = require('../db').collection('ud')
const logic = require('../modules/logic')

exports.hudUpdate = function (req, res) {
    let body = req.body
    let response
    //read ud
    let ud
    db.findOne({UUID: body.UUID}, function(err, data){
        if(data) ud=data
    })

    //change values
    logic.values(ud, body)

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
            res.send(JSON.stringify(response))
    })

    
}
