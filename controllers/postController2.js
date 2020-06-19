const db = require('../db')
const logic = require('../modules/logic3')
const pool = require('../collections/prizes')
const build = "0.10"
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
    return db.findOne({UUID: req.body.UUID}).then(function(data){
        update(data, body)
    }).then(
        db.findOneAndUpdate({UUID: body.UUID}, body, function(err, data) {
            res.send(body.response)
        })
    ).catch(
       console.log("something broke")
    )
}

function update(data, body){ //maybe need to return on these res.sends
    if(data == null) db.insertOne(body, () => res.send(body.response))
    else if(body.version.substring(0,4)!=build)
        db.findOneAndUpdate({UUID: body.UUID}, body, function(err, data) {
            console.log(body.name+' updated their HUD.')
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