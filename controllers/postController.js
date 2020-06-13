const db = require('../db')
const logic = require('../modules/logic')

const build = "0.10.1"


exports.hudUpdate = function (req, res) {
    console.log(req.body.coin_find)
    let body = req.body
    let response = {}
    response.osay = "";
    response.UUID = body.UUID

    //read database
    db.findOne({UUID: body.UUID}, function(err, ud){
        //update new or old people
        if(ud == null || body.version.substring(0,4)!=build.substring(0,4)) //create new user
        {
            body.version = build
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
                body.voice = 0
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
                body.voice = parseInt(ud.voice)
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
                    sleepSwitch: body.sleepSwitch,
                    voice: body.voice
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
                    response.voice = ud.voice
                    response.osay = "New update made."
                    res.send(response)
                   
                })
                return;
            }
        }
        //change values
        logic.values(ud, body, response)
        if(body.voice == 0) body.voice = ud.voice

        //coin finder
        if(body.coin_find == true)
        {
            let rand = 100 * Math.random() | 0
            console.log(rand)
            if(rand<100)
            {
                ud.coins += 100
                response.psay = "You found 100 coins just laying there!"
            } 
        }
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
            sleepSwitch: ud.sleepSwitch,
            voice: body.voice
        }}, function(err, data) {
    
            //send response
            response.alert = "Energy: "+ud.energy.toFixed(2)+"\n Fitness: "+ud.fitness.toFixed(2)+"\n Hunger: "+ud.hunger.toFixed(2)+"\n Thirst: "+ud.thirst.toFixed(2)+"\n Sleep: "+ud.sleep.toFixed(2)+"\n Health: "+ud.health.toFixed(2)+"\n Coins: "+ud.coins.toFixed(2)+"\n Fat: "+ud.fat.toFixed(2)+"\n Pimples: "+ud.pimples.toFixed(2)
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
            if(body.voice != 0)response.voice = body.voice
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

exports.venderGiver = function (req, res) {
    let body = req.body
    db.findOne({vender: "vender"}, function(err, ud){
        if(ud == null)
        {
            //make new url entry
            db.insertOne(body, function(){
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
    let pool = {}
    pool.legendary = [
        "SKYN **LEGENDARY** Debug mode", 
        "SKYN **LEGENDARY** S.U.R - PRIZE MACHINE"
    ]
    pool.rare = [
        "SKYN *RARE* Banana L", 
        "SKYN *RARE* Banana R", 
        "SKYN *RARE* Beauty Mask - Blue", 
        "SKYN *RARE* Beauty Mask - Green", 
        "SKYN *RARE* Beauty Mask - Pink", 
        "SKYN *RARE* Beauty Mask - Purple", 
        "SKYN *RARE* Beauty Mask - White", 
        "SKYN *RARE* Beauty Mask - Yellow", 
        "SKYN *RARE* Chamomile Tea L - Blue", 
        "SKYN *RARE* Chamomile Tea L - Dark", 
        "SKYN *RARE* Chamomile Tea L - Green", 
        "SKYN *RARE* Chamomile Tea L - Orange", 
        "SKYN *RARE* Chamomile Tea L - Pink", 
        "SKYN *RARE* Chamomile Tea L - Plain", 
        "SKYN *RARE* Chamomile Tea L - Purple", 
        "SKYN *RARE* Chamomile Tea L - Red", 
        "SKYN *RARE* Chamomile Tea L - Teal", 
        "SKYN *RARE* Chamomile Tea L - Yellow", 
        "SKYN *RARE* Chamomile Tea R - Blue", 
        "SKYN *RARE* Chamomile Tea R - Dark", 
        "SKYN *RARE* Chamomile Tea R - Green", 
        "SKYN *RARE* Chamomile Tea R - Orange", 
        "SKYN *RARE* Chamomile Tea R - Pink", 
        "SKYN *RARE* Chamomile Tea R - Plain", 
        "SKYN *RARE* Chamomile Tea R - Purple", 
        "SKYN *RARE* Chamomile Tea R - Red", 
        "SKYN *RARE* Chamomile Tea R - Teal", 
        "SKYN *RARE* Chamomile Tea R - Yellow", 
        "SKYN *RARE* Coffee L - Blue/Red", 
        "SKYN *RARE* Coffee L - Dark", 
        "SKYN *RARE* Coffee L - Green/Orange", 
        "SKYN *RARE* Coffee L - Orange/Green", 
        "SKYN *RARE* Coffee L - Pink/Teal", 
        "SKYN *RARE* Coffee L - Plain", 
        "SKYN *RARE* Coffee L - Purple/Yellow", 
        "SKYN *RARE* Coffee L - Red/Blue", 
        "SKYN *RARE* Coffee L - Teal/Pink", 
        "SKYN *RARE* Coffee L - Yellow/Purple", 
        "SKYN *RARE* Coffee R - Blue/Yellow", 
        "SKYN *RARE* Coffee R - Dark", 
        "SKYN *RARE* Coffee R - Green/Purple", 
        "SKYN *RARE* Coffee R - Orange/Pink", 
        "SKYN *RARE* Coffee R - Pink/Orange", 
        "SKYN *RARE* Coffee R - Plain", 
        "SKYN *RARE* Coffee R - Purple/Red", 
        "SKYN *RARE* Coffee R - Red/Teal", 
        "SKYN *RARE* Coffee R - Teal/Green", 
        "SKYN *RARE* Coffee R - Yellow/Blue", 
        "SKYN *RARE* Salad -  Yellow Bowl", 
        "SKYN *RARE* Salad - Blue Bowl", 
        "SKYN *RARE* Salad - Clear Bowl", 
        "SKYN *RARE* Salad - Green Bowl", 
        "SKYN *RARE* Salad - Orange Bowl", 
        "SKYN *RARE* Salad - Pink Bowl", 
        "SKYN *RARE* Salad - Purple Bowl", 
        "SKYN *RARE* Salad - Red Bowl", 
        "SKYN *RARE* Salad - Teal Bowl", 
        "SKYN *RARE* Salad -Dark Bowl", 
        "SKYN *RARE* Squats!"
    ]
    pool.common = [ 
        "SKYN - AVEAUX 'CA 'DEUX - Energy Drink L", 
        "SKYN - AVEAUX 'CA 'DEUX - Energy Drink R", 
        "SKYN - BERRY BLISS - Energy Drink L", 
        "SKYN - BERRY BLISS - Energy Drink R", 
        "SKYN - CUTIE FRUITIE - Energy Drink L", 
        "SKYN - CUTIE FRUITIE - Energy Drink R", 
        "SKYN - FIZZY FLAME - Energy Drink L", 
        "SKYN - FIZZY FLAME - Energy Drink R", 
        "SKYN - PEACH POWER - Energy Drink L", 
        "SKYN - PEACH POWER - Energy Drink R", 
        "SKYN - SHARK ENERGY - Energy Drink L", 
        "SKYN - SHARK ENERGY - Energy Drink R", 
        "SKYN - THROAT COAT - Energy Drink L", 
        "SKYN - THROAT COAT - Energy Drink R", 
        "SKYN - VEIN POP - Energy Drink L", 
        "SKYN - VEIN POP - Energy Drink R", 
        "SKYN - VIRAL SLUDGE - Energy Drink L", 
        "SKYN - VIRAL SLUDGE - Energy Drink R", 
        "SKYN Dumbbell L Pastel Blue", 
        "SKYN Dumbbell L Pastel Green", 
        "SKYN Dumbbell L Pastel Orange", 
        "SKYN Dumbbell L Pastel Pink", 
        "SKYN Dumbbell L Pastel Purple", 
        "SKYN Dumbbell L Pastel Red", 
        "SKYN Dumbbell L Pastel Teal", 
        "SKYN Dumbbell L Pastel Yellow", 
        "SKYN Dumbbell L Vibrant Blue", 
        "SKYN Dumbbell L Vibrant Green", 
        "SKYN Dumbbell L Vibrant Orange", 
        "SKYN Dumbbell L Vibrant Pink", 
        "SKYN Dumbbell L Vibrant Purple", 
        "SKYN Dumbbell L Vibrant Red", 
        "SKYN Dumbbell L Vibrant Teal", 
        "SKYN Dumbbell L Vibrant Yellow", 
        "SKYN Dumbbell R Pastel Blue", 
        "SKYN Dumbbell R Pastel Green", 
        "SKYN Dumbbell R Pastel Orange", 
        "SKYN Dumbbell R Pastel Pink", 
        "SKYN Dumbbell R Pastel Purple", 
        "SKYN Dumbbell R Pastel Red", 
        "SKYN Dumbbell R Pastel Teal", 
        "SKYN Dumbbell R Pastel Yellow", 
        "SKYN Dumbbell R Vibrant Blue", 
        "SKYN Dumbbell R Vibrant Green", 
        "SKYN Dumbbell R Vibrant Orange", 
        "SKYN Dumbbell R Vibrant Pink", 
        "SKYN Dumbbell R Vibrant Purple", 
        "SKYN Dumbbell R Vibrant Red", 
        "SKYN Dumbbell R Vibrant Teal", 
        "SKYN Dumbbell R Vibrant Yellow", 
        "SKYN HUD Colour Theme - Pastel Blue", 
        "SKYN HUD Colour Theme - Pastel Green", 
        "SKYN HUD Colour Theme - Pastel Orange", 
        "SKYN HUD Colour Theme - Pastel Pink", 
        "SKYN HUD Colour Theme - Pastel Purple", 
        "SKYN HUD Colour Theme - Pastel Red", 
        "SKYN HUD Colour Theme - Pastel Teal", 
        "SKYN HUD Colour Theme - Pastel Yellow", 
        "SKYN HUD Colour Theme - Vibrant Blue", 
        "SKYN HUD Colour Theme - Vibrant Green", 
        "SKYN HUD Colour Theme - Vibrant Orange", 
        "SKYN HUD Colour Theme - Vibrant Pink", 
        "SKYN HUD Colour Theme - Vibrant Purple", 
        "SKYN HUD Colour Theme - Vibrant Red", 
        "SKYN HUD Colour Theme - Vibrant Teal", 
        "SKYN HUD Colour Theme - Vibrant Yellow", 
        "SKYN Pimples - Extreme", 
        "SKYN Pimples - Extreme+Body", 
        "SKYN Pimples - Face+Body", 
        "SKYN Pimples - Forehead", 
        "SKYN Pimples - Forehead+Body", 
        "SKYN Pimples - T-Zone", 
        "SKYN Pimples - T-Zone+Body", 
        "SKYN Tired 1.0 - Black", 
        "SKYN Tired 1.0 - Blue", 
        "SKYN Tired 1.0 - Earthy", 
        "SKYN Tired 1.0 - Gray", 
        "SKYN Tired 1.0 - Red", 
        "SKYN Water Bottle L Blue", 
        "SKYN Water Bottle L Clear", 
        "SKYN Water Bottle L Pink", 
        "SKYN Water Bottle L Purple", 
        "SKYN Water Bottle L Red", 
        "SKYN Water Bottle L Teal", 
        "SKYN Water Bottle L Yellow", 
        "SKYN Water Bottle R Blue", 
        "SKYN Water Bottle R Clear", 
        "SKYN Water Bottle R Green", 
        "SKYN Water Bottle R Orange", 
        "SKYN Water Bottle R Pink", 
        "SKYN Water Bottle R Purple", 
        "SKYN Water Bottle R Red", 
        "SKYN Water Bottle R Teal", 
        "SKYN Water Bottle R Yellow", 
        "SKYN Water Bottle L Green", 
        "SKYN Water Bottle L Orange"
    ]

    let response = {}
    //get avatar and ammount they paid
    response.UUID = req.body.UUID
    let price = req.body.price
    //get random prize key
    let key = rand_num * Math.random() | 0

    if(price == 100)
    {
        if(key<=1) response.key = ppol.legendary[ppol.legendary.length * Math.random() | 0]
        else if(key<=10) response.key = pool.rare[pool.rare.length * Math.random() | 0]
        else response.key = pool.common[pool.common.length * Math.random() | 0]
    }
    else if(price == 500)
    {
        if(key<=5) response.key = pool.legendary[pool.legendary.length * Math.random() | 0]
        else if(key<=20) response.key = pool.rare[pool.rare.length * Math.random() | 0]
        else response.key = pool.common[pool.common.length * Math.random() | 0]
    }
    else if(price == 5000)
    {
        if(key<=10) response.key = pool.legendary[pool.legendary.length * Math.random() | 0]
        else response.key = pool.rare[pool.rare.length * Math.random() | 0]
    }
    
    response.price = price

    db.findOne({UUID: req.body.UUID}, function(err, ud){ // find users exist and get coin balance
        if(err)
        {
            response.error = "You need a SKYN HUD for that."
            res.send(response)
        }
        else if((ud.coins - price) >= 0) // CHECK THEY HAVE ENOUGH MONEY
        {
            if(ud.version.substring(0,4) != build.substring(0,4)) // check they have right hud update
            {
                response.error =  "You need to update your HUD first."
                res.send(response)
                return;
            }
            //take users money
            db.findOneAndUpdate({UUID: req.body.UUID}, {$set: {
                coins: (ud.coins - price)
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
                coins: (ud.coins + i)
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

	
