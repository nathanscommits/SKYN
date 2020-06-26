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
            //voice: req.body.voice,
            features: req.body.features,
            attached: req.body.attached,
            action: req.body.action,
            consumed: req.body.consumed,
            debug: req.body.debug, 
            coin_find: req.body.coin_find,
            slapped: req.body.slapped,
            slapping: req.body.slapping,
            timeOfDay: req.body.timeOfDay,
            inSun: req.body.inSun
        },
        response: {
            osay: "",
            psay: "",
            csay: "",
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
    if(req.body.voice>0) body.info.voice = req.body.voice

    let myPromise = () => (
        new Promise((resolve, reject) => {
            db.findOne({UUID: req.body.UUID})

                .then(function(data){
                    if(data == null) db.insertOne(body, () => {
                        console.log(body.name+" - New user created")
                        resolve(body.response)
                    }) 
                    else if(data.version.substring(0,4)!=build) {

                        try {
                            if(data.values.coins > 0) body.values.coins = data.values.coins
                            console.log("coins found in data values")
                        }
                        catch(err) {
                            try {
                                if(data.coins > 0) body.values.coins = data.coins
                                console.log("coins found in data")
                            }
                            catch(err) {
                                console.log("No coin data found")
                            }
                        }
                        try {
                            if(data.prizeName.length() >= 0) body.prizeName = data.prizeName
                        }
                        catch(err) {
                            console.log("No prizes found")
                        }
                        try {
                            if(data.values.timeAlive > 0) body.values.timeAlive = data.values.timeAlive
                        }
                        catch(err) {
                            try{
                                if(data.timeAlive > 0) body.values.timeAlive = data.timeAlive
                            }
                            catch(err) {
                                console.log("no time alive stat")
                            }
                        }
                        try {
                            if(data.values.deathCount > 0) body.values.deathCount = data.values.deathCount
                        }
                        catch(err) {
                            try {
                                if(data.deathCount > 0) body.values.deathCount = data.deathCount
                            }
                            catch(err) {
                                console.log("no death count stat")
                            }
                        }
                        try {
                            if(data.info.slapped > 0) body.info.slapped += data.info.slapped
                        }
                        catch(err) {
                            console.log("no slapped info")
                        }
                        try {
                            if(data.info.slapping > 0) body.info.slapping += data.info.slapping
                        }
                        catch(err) {
                            console.log("no sapping info")
                        }
                        try {
                            if(data.voice > 0) body.info.voice = data.voice
                        }
                        catch(err) {
                            try {
                                if(data.info.voice > 0) body.info.voice = data.info.voice
                            }
                            catch(err) {
                                console.log("No voice settings found")
                            }
                        }
                        db.findOneAndUpdate({UUID: body.UUID}, { $set: body }, function(err, data) {
                            console.log(body.name+' updated their HUD.')
                            body.version = build
                            body.response.UUID = body.UUID
                            body.response.version = body.version
                            resolve(body.response)
                         })
                    } else if(data.version.substring(0,4)==build) {
                        body.values = data.values
                        body.states = data.states
                        body.info.slapped = parseInt(body.info.slapped) + parseInt(data.info.slapped)
                        body.info.slapping = parseInt(body.info.slapping) + parseInt(data.info.slapping)
                        if(body.info.voice <= 0) body.info.voice = data.info.voice
                        if(body=logic.values(body)) resolve("logic passed")
                        else reject("failed to process logic")
                    }
                    else console.log("no version resolving")
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
                            "\n Pimples: " + parseFloat(body.values.pimples).toFixed(2)+
                            "\n Slapped: " + parseFloat(body.info.slapped).toFixed(2)+
                            "\n Slapping: " + parseFloat(body.info.slapping).toFixed(2)+
                            "\n Voice: " + parseFloat(body.info.voice).toFixed(2)
                    else body.response.hover = ""

                    //console.log("promise resolved")
                    body.response.UUID = body.UUID
                    body.response.version = body.version
                    resolve(res.send({...body.response, ...body.values}))
                })

                .catch(err => console.log("something went wrong" + err))
        })
    )
    myPromise()
}