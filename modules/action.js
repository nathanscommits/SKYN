const anims = require('../modules/anims')
const sound = require('../modules/sounds')
function rlv(osay, method, file) {
    let rlv_folder = "~SKYN_HUD/"
    if(osay.substring(0,1) == "@") osay += ","+method+":"+rlv_folder+"~"+file+"=force"
    else osay += "@"+method+":"+rlv_folder+"~"+file+"=force"
    return osay
}
module.exports = function(body) {
    let action = body.info.action

    if(action.substring(5, 6)=="0") { //not sleeping
        if(body.states.sleeping != 0) {
            body.response.osay = rlv(body.response.osay, "detach", "SKYN_SleepParticles")
            body.response.loop = "endAnim"
            body.states.sleeping = 0
        }
    }
    if(action.substring(1, 2)=="1") body.values.energy-=8 //flying
    if(action.substring(2, 3)=="1") body.values.energy-=4 //running
    if(action.substring(3, 4)=="1") body.values.energy-=2 //walking/running
    if(action.substring(4, 5)=="1") body.values.energy-=8 //jumping
    if(body.values.energy<=0) {
        body.response.anim = anims.exhausted
        body.response.sound = sound.play(body.info.voice, "breathing") //return queue here somehow too
    } else if(body.values.energy < body.values.fitness/4) {
        let chance = 100 * Math.random() | 0
        if(chance<10) {
            if(chance<5) body.response.anim = anims.sweatwipe
            else body.response.anim = anims.fanning[anims.fanning * Math.random() | 0]
        }
    }
    if(action.substring(0,5)=="00000") { //standing
        body.values.energy+=(body.values.fitness/100) //regain body.values.energy while idle
        body.values.fitness-=0.01 //passive body.values.fitness loss
    }
    if(action.substring(0, 1)=="1") { //sitting
        body.values.energy+=(body.values.fitness/50) //resting
        if(parseInt(action.substring(5, 6))>=1) { //sleeping on ground =1 on object =2
            body.values.sleep--
            body.values.energy+=(body.values.fitness/20) //resting even more
            body.response.sound = sound.play(body.info.voice, "snore")
            //particles
            if(body.states.sleeping !=1) {
                body.response.osay = rlv(body.response.osay, "attachover", "SKYN_SleepParticles")
                body.states.sleeping = 1
                if(action.substring(5,6)=="1") //ground sleeping
                    body.response.loop = anims.sleeps[anims.sleeps.length * Math.random() | 0]
                else //chair sleeping
                    body.response.loop = anims.csleeps
            }   
        } else if(body.info.features.substring(3,4)=="1") //sitting but not sleeping
            body.values.sleep+=0.05 //get body.values.sleepy if not body.values.sleeping while sitting
    }
    else if(body.info.features.substring(3,4)=="1") // not sitting
        body.values.sleep+=0.1 //not sitting, sleepy! you could do 1/energy to make it based off of energy loss

    if(body.values.energy<body.values.fitness || body.values.oxygen < 100) {
        body.values.fitness += 100/body.values.fitness //fitness gain when exercising, more fitness means harder to earn fitness
        body.values.fat-=0.1
    }

    let hour = parseInt(body.info.timeOfDay.substring(0,2))
    if(body.states.timeInSun>0) body.values.tan+=0.1
    if(body.info.inSun == 1 && hour > 5 && hour < 19) {
        if(body.states.sunscreen <= 0) body.states.timeInSun+=2
        body.values.tan+=0.1
        if(body.states.timeInSun>=1200  && body.info.features.substring(6,7)=="1") {
            let chance = 100 * Math.random() | 0
            if(chance<10) {
                body.response.anim = anims.sunny
                body.response.sound = sound.play(body.info.voice, "sizzle")
            }
            if(body.info.features.substring(2,3)=="1")body.values.thirst -= 1
        }
    } else {
        body.states.timeInSun-=2
        if(body.states.timeInSun<=0)body.values.tan-=0.1
    }

    body.states.sunscreen -= 2

    let posString = body.info.pos
    posString = posString.replace(">", "")
    posString = posString.replace("<", "")
    let poz = posString.split(",")
    
    if(body.info.wet_object != "none" && body.info.wet_object != "" || body.info.water > poz[2]-0.5) { //body.info.submerged == 1
        body.states.wet = 120
        if(action.substring(1, 5)!="0000") 
            sound.play(body.info.voice, "splash")
        if(body.info.features.substring(5,6)=="1" && body.info.water > poz[2]+1) body.values.oxygen -= 1
    } else {
        body.values.oxygen += 5
    }

    if(body.states.wet>0)body.states.wet-=2


    return body
}