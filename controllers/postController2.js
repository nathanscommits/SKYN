const db = require('../db')
const logic = require('../modules/logic3')
const pool = require('../collections/prizes')
const build = "0.11"
let body = {}
exports.hudUpdate = function (req, res) {
    
    body.UUID = req.body.UUID
    body.name = req.body.name
    body.version = req.body.version
    body.response = {
        osay: "",
        hover : "",
        anim: "",
        sound: "",
        rlv: "",
        loop: "",
        version: build + body.version.substring(4)
    }
    body.values = {
        energy: 100,
        fitness: 100,
        hunger: 50,
        thirst: 50,
        fat: 50,
        sleep: 50,
        health: 100,
        coins: 0,
        pimples: 0
    }
    body.states = {
        death: 0,
        sleeping: 0,
        exhausted: 0,
        sweat: 0,
        pimples: 0,
        shape: 0,
        timer: 0
    }
    body.info = {
        listen: req.body.listen,
        objects: req.body.objects,
        voice: req.body.voice,
        features: req.body.features,
        attached: req.body.attached,
        action: req.body.action,
        consumed: req.body.consumed,
        debug: req.body.debug
    }
    db.findOne({UUID: req.body.UUID}, function(err, data){
        if(data == null) db.insertOne(body, () => {
            console.log("new entry in db")
            res.send(body.response)
        }) 
        else if(body.version.substring(0,4)!=build)
            db.findOneAndUpdate({UUID: body.UUID}, body, function(err, data) {
                console.log("updating..."+body.name+' updated their HUD.')
                res.send(body.response)
            })
        else
        {
            body.values = data.values
            body.states = data.states
            //body.info.voice = data.info.voice
            //body.info.debug = data.info.debug
            //body.info.features = data.info.features
            logic.values(body)
            if(body.info.debug == true)
                body.response.hover = "Energy: "+parseFloat(body.values.energy).toFixed(2)+
                                "\n Fitness: "+parseFloat(body.values.fitness).toFixed(2)+
                                "\n Hunger: "+parseFloat(body.values.hunger).toFixed(2)+
                                "\n Thirst: "+parseFloat(body.values.thirst).toFixed(2)+
                                "\n Sleep: "+parseFloat(body.values.sleep).toFixed(2)+
                                "\n Health: "+parseFloat(body.values.health).toFixed(2)+
                                "\n Coins: "+parseFloat(body.values.coins).toFixed(2)+
                                "\n Fat: "+parseFloat(body.values.fat).toFixed(2)+
                                "\n Pimples: "+parseFloat(body.values.pimples).toFixed(2)
            else body.response.hover = ""
            db.findOneAndUpdate({UUID: body.UUID}, body, function(err, data) {
                
                console.log("working..."+body.response)
                res.send(body)  
            })
        }
    })
}

    /*}).then(    
        db.findOneAndUpdate({UUID: body.UUID}, body, function(err, data) {
            res.send(body.response)
        })
    ).catch(
       console.log("something broke")
    )
}
/*
function update(res, data, body){ //maybe need to return on these res.sends
    if(data == null) db.insertOne(body, () => {
        res.send(body.response)
        return
    }) 
    else if(body.version.substring(0,4)!=build)
        db.findOneAndUpdate({UUID: body.UUID}, body, function(err, data) {
            console.log(body.name+' updated their HUD.')
            res.send(body.response)
            return
        })
    else
    {
        body.values = data.values
        body.states = data.states
        //body.info.voice = data.info.voice
        //body.info.debug = data.info.debug
        //body.info.features = data.info.features
        logic.values(body)
    }
}
/*
let body = {}
function object(req){
    body.UUID = req.body.UUID
    body.name = req.body.name
    body.version = req.body.version
    body.response = {
        osay: "",
        hover : "",
        anim: "",
        sound: "",
        rlv: "",
        loop: "",
    }
    body.values = {
        energy: 100,
        fitness: 100,
        hunger: 50,
        thirst: 50,
        fat: 50,
        sleep: 50,
        health: 100,
        coins: 0,
        pimples: 0
    }
    body.states = {
        death: 0,
        sleeping: 0,
        exhausted: 0,
        sweat: 0,
        pimples: 0,
        shape: 0,
        timer: 0
    }
    body.info = {
        listen: req.body.listen,
        objects: req.body.objects,
        voice: req.body.voice,
        features: req.body.features,
        attached: req.body.attached,
        action: req.body.action,
        consumed: req.body.consumed,
        debug: req.body.debug
    }
}
*/