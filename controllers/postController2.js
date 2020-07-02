const db = require('../db')
const logic = require('../modules/logic3')
const { ObjectId } = require('mongodb')
const build = "0.11"
let body = {}
exports.hudUpdate = function (req, res) {
    
    body = {
        id: req.body.UUID,
        UUID: req.body.UUID,
        name: req.body.name,
        version: build,
        info:{
            listen: req.body.listen,
            voice: req.body.voice,
            features: req.body.features,
            attached: req.body.attached,
            action: req.body.action,
            consumed: req.body.consumed,
            debug: req.body.debug, 
            coin_find: req.body.coin_find,
            slapped: req.body.slapped,
            slapping: req.body.slapping,
            timeOfDay: req.body.timeOfDay,
            inSun: req.body.inSun,
            water: req.body.water,
            pos: req.body.position,
            submerged: req.body.submerged,
            warm_object: req.body.warm_object,
            wet_object: req.body.wet_object,
            warm_object_range: req.body.warm_object_range,
            wet_object_range: req.body.wet_object_range,
            simName: req.body.simName,
            wind: req.body.wind
        },
        response: {
            osay: "",
            psay: "",
            csay: "",
            hover : "",
            anim: "",
            sound: "",
            rlv: "",
            loop: "",
            version: build,
            announce: ""
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
            deathCount: 0,
            tan: 0,
            oxygen: 100
        },
        states: {
            death: 0,
            sleeping: 0,
            exhausted: 0,
            sweat: 0,
            pimples: 0,
            shape: 0,
            timer: 0,
            timeInSun: 0,
            sunburn: 0,
            tan: 0,
            wet: 0,
            dry: 0,
            sunscreen: 0
        }
    }

    let myPromise = () => (
        new Promise((resolve, reject) => {

            db.findOneAndUpdate(
                {UUID: req.body.UUID},
                { $setOnInsert: body, },
                {
                    returnOriginal: false,
                    upsert: true,
                }
            )

                .then(function(data){
                    console.log(data)
                    //if(!data.response.version) reject(console.log("no data to process"))
                    if(data.response.version == build) {
                        body.values = data.values
                        body.states = data.states
                        body.info.slapped = parseInt(req.body.slapped) + parseInt(data.info.slapped)
                        body.info.slapping = parseInt(req.body.slapping) + parseInt(data.info.slapping)
                        if(body.info.voice <= 0) body.info.voice = data.info.voice
                        if(body=logic.values(body)) resolve("logic passed")
                        else reject("failed to process logic")
                    } else {
                        body.response.psay = "SKYN HUD was updated from "+data.response.version+" to "+build
                        console.log(data)
                        try {
                            if(data.values.coins > 0) body.values.coins = data.values.coins
                        } catch(err) {
                            try {
                                if(data.coins > 0) body.values.coins = data.coins
                            } catch(err) {
                                console.log("No coin data found")
                            }
                        } try {
                            if(data.prizeName.length() >= 0) body.prizeName = data.prizeName
                        } catch(err) {
                            console.log("No prizes found")
                        } try {
                            if(data.values.timeAlive > 0) body.values.timeAlive = data.values.timeAlive
                        } catch(err) {
                            try{
                                if(data.timeAlive > 0) body.values.timeAlive = data.timeAlive
                            } catch(err) {
                                console.log("no time alive stat")
                            }
                        } try {
                            if(data.values.deathCount > 0) body.values.deathCount = data.values.deathCount
                        } catch(err) {
                            try {
                                if(data.deathCount > 0) body.values.deathCount = data.deathCount
                            } catch(err) {
                                console.log("no death count stat")
                            }
                        } try {
                            if(data.info.slapped > 0) body.info.slapped += parseInt(data.info.slapped)
                        } catch(err) {
                            console.log("no slapped info")
                        } try {
                            if(data.info.slapping > 0) body.info.slapping += parseInt(data.info.slapping)
                        } catch(err) {
                            console.log("no slapping info")
                        } try {
                            if(data.info.voice) body.info.voice = data.info.voice    
                        } catch(err) {
                            try {
                                if(data.voice) body.info.voice = data.voice
                            } catch(err) {
                                console.log("No voice settings found")
                            }
                        }
                        
                        //body.version = build
                        db.findOneAndUpdate({UUID: req.body.UUID}, { $set: body }, function(err, data) {
                            
                            body.response.UUID = body.UUID
                            body.response.version = build
                            resolve(console.log(body.name+' updated their HUD.'))
                            })
                    }
                })

                .then(data => db.findOneAndUpdate({ UUID: req.body.UUID }, { $set: body }, { upsert:true } ))

                .then(function(data){
                    if (body.info.debug == true)
                        body.response.hover = "Energy: " + parseFloat(body.values.energy).toFixed(2) +
                            "\n Fitness: " + parseFloat(body.values.fitness).toFixed(2) +
                            "\n Hunger: " + parseFloat(body.values.hunger).toFixed(2) +
                            "\n Thirst: " + parseFloat(body.values.thirst).toFixed(2) +
                            "\n Sleep: " + parseFloat(body.values.sleep).toFixed(2) +
                            "\n Health: " + parseFloat(body.values.health).toFixed(2) +
                            "\n Oxygen: " + parseFloat(body.values.oxygen).toFixed(0) +
                            "\n Coins: " + parseFloat(body.values.coins).toFixed(2) +
                            "\n Fat: " + parseFloat(body.values.fat).toFixed(2) +
                            "\n Pimples: " + parseFloat(body.values.pimples).toFixed(0)+
                            "\n Slapped: " + parseFloat(body.info.slapped).toFixed(0)+
                            "\n Slapping: " + parseFloat(body.info.slapping).toFixed(0)+
                            //"\n Voice: " + parseFloat(body.info.voice).toFixed(0)+
                           // "\n Deaths: " + parseFloat(body.values.deathCount).toFixed(0)+
                           "\n Tan: " + body.values.tan.toFixed(0)+
                           "\n timeInSun: " + body.states.timeInSun.toFixed(0)
                    else body.response.hover = ""

                    //console.log("promise resolved")
                    body.response.UUID = body.UUID
                    body.response.version = build
                    resolve(res.send({...body.response, ...body.values}))
                })

                .catch( err => { 
                    console.log("Something went wrong. " + err)
                    res.send("Something went wrong")
                })
        })
    )
    myPromise()
}