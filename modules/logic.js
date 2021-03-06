const { response } = require("express");
const time = require('../modules/region_time')
const objects = require('../modules/objects')
const features = require('../modules/features')
const coins = require('../modules/coins')
const listen = require('../modules/listen')
const action = require('../modules/action')
const rlva = require('../modules/rlv')
const health = require('../modules/health')

exports.values = function(body) {

    body.response.osay = ""

    if(body.info.onAttach == 1) {
        body.response.announce = "SKYN is now in BETA! We are gearing up to release our new expansion \"Summer Fun\" along with a whole new prize machine full of glorious items to spend your SKYN Coins on! Thanks for your support so far <3 "
        body.response.osay = "@detachall:~SKYN_HUD=force"
        body.states = {
            death: body.states.death,
            sleeping: body.states.sleeping,
            exhausted: body.states.exhausted,
            sweat: 0,
            pimples: 0,
            shape: 0,
            timer: body.states.timer,
            timeInSun: body.states.timeInSun,
            sunburn: 0,
            tan: 0,
            wet: body.states.wet,
            dry: 0,
            sunscreen: body.states.sunscreen
        }
    }

    body = time(body) //get region time
    body = objects(body) //get nearby relevant objects
    body = features(body) //set feature on/off
    body = coins(body) //handle coin balance
    body = listen(body) //handle consumables and listen commands
    body = action(body) //handle movement and physical state
    body = rlva(body) //most of the RLV commands
    body = health(body) //hand health and death
    
    //value min/max's
    if(body.values.energy<0) body.values.energy=0
    if(body.values.energy>body.values.fitness) body.values.energy=body.values.fitness
    if(body.values.sleep>100) body.values.sleep=100
    if(body.values.sleep<0) body.values.sleep=0
    if(body.values.fitness<100) body.values.fitness=100
    if(body.values.hunger>100) body.values.hunger=100
    if(body.values.hunger<0) body.values.hunger=0
    if(body.values.thirst>100) body.values.thirst=100
    if(body.values.thirst<0) body.values.thirst=0
    if(body.values.pimples>100) body.values.pimples=100
    if(body.values.pimples<0) body.values.pimples=0
    if(body.values.fat>100) body.values.fat=100
    if(body.values.fat<0) body.values.fat=0
    if(body.values.health>100) body.values.health=100
    if(body.values.health<0) body.values.health=0
    if(body.values.coins<0) body.values.coins=0
    if(body.states.timeInSun<0) body.states.timeInSun=0
    else if(body.states.timeInSun>1200) body.states.timeInSun=1200
    if(body.states.wet<0) body.states.wet=0
    if(body.values.tan<-100) body.values.tan = -100
    else if(body.values.tan>100) body.values.tan = 100
    if(body.values.oxygen<0) body.values.oxygen = 0
    else if(body.values.oxygen>100) body.values.oxygen = 100
    if(body.states.sunscreen < 0) body.states.sunscreen = 0
    if(body.values.dirt < 0) body.values.dirt = 0
    else if(body.values.dirt > 100) body.values.dirt = 100
    if(body.values.hair < 0) body.values.hair = 0
    else if(body.values.hair > 100) body.values.hair = 100
    if(body.values.sick < 0) body.values.sick = 0
    else if(body.values.sick > 100) body.values.sick = 100

    return body
}