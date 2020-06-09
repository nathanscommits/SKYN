const db = require('../db')
const logic = require('../modules/logic')

exports.hudUpdate = function (req, res) {
    let body = req.body
    let response
    let ud
    //read ud
    console.log(body)
    db.findOne({UUID: body.UUID}, function(err, data){
        console.log(data)
        ud=data

        logic.values(ud, body)

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
            pimples: 100,
            energy: 100,
            deathCount: ud.deathCount
        }}, function(err, data) {
    
            //send response
            response+= {
            osay: "You died!",
            anim: "death",
            sound: "dieing"
            }
            res.send(JSON.stringify(response))
        })
    })

    //change values
   

    //save ud
    

    
}
