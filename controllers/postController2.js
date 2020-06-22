const db = require('../db')
const logic = require('../modules/logic3')
const build = "0.11"
let body = {}
exports.hudUpdate = function (req, res) {
    body = {
        UUID: req.body.UUID,
        name: req.body.name,
        version: req.body.version,
        info:{
            listen: req.body.listen,
            objects: req.body.objects,
            voice: req.body.voice,
            features: req.body.features,
            attached: req.body.attached,
            action: req.body.action,
            consumed: req.body.consumed,
            debug: req.body.debug 
        },
        response: {
            osay: "",
            hover : "",
            anim: "",
            sound: "",
            rlv: "",
            loop: ""
        },
        values: {
            energy: 100,
            fitness: 100,
            hunger: 50,
            thirst: 50,
            fat: 50,
            sleep: 50,
            health: 100,
            coins: 0,
            pimples: 0,
            timeAlive: 0,
            deathCount: 0
        },
        states: {
            death: 0,
            sleeping: 0,
            exhausted: 0,
            sweat: 0,
            pimples: 0,
            shape: 0,
            timer: 0
        }
    }
    let myPromise = () => (
        new Promise((resolve, reject) => {
            db.findOne({UUID: req.body.UUID})

                .then(function(data){
                    if(data == null) db.insertOne(body, () => {
                        console.log(body.name+" - New user created")
                        resolve(body.response)
                    }) 
                    else if(req.body.version.substring(0,4)!=build)
                        db.findOneAndUpdate({UUID: body.UUID}, { $set: body }, function(err, data) {
                           console.log(body.name+' updated their HUD.')
                           body.version = build
                           resolve(body.response)
                        })
                    else {
                        //console.log(data)
                        body.values = data.values
                        body.states = data.states
                        if(body=logic.values(body)) resolve("logic passed")
                        else reject("failed to process logic")
                    }
                })

                .then(data => db.findOneAndUpdate({ UUID: body.UUID }, { $set: body }, { upsert:true } ))

                .then(function(data){
                    if (body.info.debug == true)
                        body.response.hover = "Energy: " + parseFloat(body.values.energy).toFixed(2) +
                            "\n Fitness: " + parseFloat(body.values.fitness).toFixed(2) +
                            "\n Hunger: " + parseFloat(body.values.hunger).toFixed(2) +
                            "\n Thirst: " + parseFloat(body.values.thirst).toFixed(2) +
                            "\n Sleep: " + parseFloat(body.values.sleep).toFixed(2) +
                            "\n Health: " + parseFloat(body.values.health).toFixed(2) +
                            "\n Coins: " + parseFloat(body.values.coins).toFixed(2) +
                            "\n Fat: " + parseFloat(body.values.fat).toFixed(2) +
                            "\n Pimples: " + parseFloat(body.values.pimples).toFixed(2)
                    else body.response.hover = ""

                    console.log("promise resolved")
                    body.response.UUID = body.UUID
                    body.response.version = body.version
                    resolve(res.send({...body.response, ...body.values}))
                })

                .catch(err => console.log("something went wrong" + err))
        })
    )
    myPromise()
}