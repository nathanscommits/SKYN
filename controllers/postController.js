const db = require('../db')
const logic = require('../modules/logic')
const pool = require('../collections/prizes')

const build = "1.0.4"

exports.hudUpdate = function (req, res) {
        //console.log(req.body)
    console.log(req.body.name)
    let body = {
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
            wind: req.body.wind,
            onAttach: req.body.onAttach
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
            energy: req.body.energy,
            fitness: req.body.fitness,
            hunger: req.body.hunger,
            thirst: req.body.thirst,
            fat: req.body.fat,
            sleep: req.body.sleep,
            health: req.body.health,
            coins: req.body.coins,
            pimples: req.body.pimples,
            timeAlive: req.body.timeAlive,
            deathCount: req.body.deathCount,
            tan: req.body.tanTime,
            oxygen: req.body.oxygen,
            slapped: req.body.total_slapping,
            slapping: req.body.total_slapped
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

    //if(isNaN(req.body.total_slapping)) body.values.slapped = 0;
    //if(isNaN(req.body.total_slapped)) body.values.slapping = 0;

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
                //console.log(data)
                //if(!data.value.response.version) reject(console.log("no data to process"))
               try {
                    if(data.value.response.version == build) {
                        body.values = data.value.values
                        body.states = data.value.states
                        body.values.slapped = parseInt(req.body.slapped) + parseInt(data.value.values.slapped)
                        body.values.slapping = parseInt(req.body.slapping) + parseInt(data.value.values.slapping)
                        if(isNaN(body.values.slapped)) body.values.slapped = 1
                        if(isNaN(body.values.slapping)) body.values.slapping = 0
                        if(body.info.voice <= 0) body.info.voice = data.value.info.voice
                        if(body=logic.values(body)) resolve("logic passed")
                        else reject("failed to process logic")
                    } 
               } catch{
                   db.remove({UUID: req.body.UUID})
                   .then( function(rem) {
                    body.response.psay = "SKYN HUD was updated to "+build
                    try{
                        if(data.value.values.fitness >=100) {
                            body.values.fitness = data.value.values.fitness
                            body.values.energy = data.value.values.fitness
                        }
                    } catch{
                        console.log("No fitness data found")
                    }
                    try {
                        if(data.value.values.coins > 0) body.values.coins = data.value.values.coins
                    } catch(err) {
                        try {
                            if(data.value.coins > 0) body.values.coins = data.value.coins
                        } catch(err) {
                            console.log("No coin data found")
                        }
                    } try { 
                        if(data.value.prizeName.length() >= 0) body.prizeName = data.value.prizeName
                    } catch(err) {
                        console.log("No prizes found")
                    } try {
                        if(data.value.values.timeAlive > 0) body.values.timeAlive = data.value.values.timeAlive
                    } catch(err) {
                        try{
                            if(data.value.timeAlive > 0) body.values.timeAlive = data.value.timeAlive
                        } catch(err) {
                            console.log("no time alive stat")
                        }
                    } try {
                        if(data.value.values.deathCount > 0) body.values.deathCount = data.value.values.deathCount
                    } catch(err) {
                        try {
                            if(data.value.deathCount > 0) body.values.deathCount = data.value.deathCount
                        } catch(err) {
                            console.log("no death count stat")
                        }
                    } try {
                        if(data.value.values.slapped > 0) body.values.slapped = data.value.values.slapped 
                    } catch(err) {
                        console.log("no slapped info")
                    } try {
                        if(data.value.values.slapping > 0) body.values.slapping = data.value.values.slapping
                    } catch(err) {
                        console.log("no slapping info")
                    } try {
                        if(data.value.info.voice) body.info.voice = data.value.info.voice    
                    } catch(err) {
                        try {
                            if(data.value.voice) body.info.voice = data.value.voice
                        } catch(err) {
                            console.log("No voice settings found")
                        }
                    }
                    
                    body.version = build
                    body.response.version = build
                    db.findOneAndUpdate({UUID: req.body.UUID}, { $set: body }, function(err, data) {
                        
                        body.response.UUID = body.UUID
                        body.response.version = build
                        resolve(console.log(body.name+' updated their HUD.'))
                        })
                    }) .catch( err => { 
                        console.log("Something went wrong inside the update promise. " + err)
                        res.send("Something went wrong")
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
                        "\n Slapped: " + parseFloat(body.values.slapped).toFixed(0)+
                        "\n Slapping: " + parseFloat(body.values.slapping).toFixed(0)+
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
        if(key<=0.5) response.key = pool.legendary[pool.legendary.length * Math.random() | 0]
        else if(key<=5) response.key = pool.rare[pool.rare.length * Math.random() | 0]
        else response.key = pool.common[pool.common.length * Math.random() | 0]
    }
    else if(price == 500)
    {
        if(key<=3) response.key = pool.legendary[pool.legendary.length * Math.random() | 0]
        else if(key<=27) response.key = pool.rare[pool.rare.length * Math.random() | 0]
        else response.key = pool.common[pool.common.length * Math.random() | 0]
    }
    else if(price == 5000)
    {
        if(key<=20) response.key = pool.legendary[pool.legendary.length * Math.random() | 0]
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
            if(ud.version != build) // check they have right hud update
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
                "values.coins": (ud.values.coins + i)
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

	
