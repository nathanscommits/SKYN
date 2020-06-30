const anims = require('../modules/anims')
const sound = require('../modules/sounds')
module.exports = function(body) {
    let listen = body.info.listen
    let consumed = body.info.consumed

    function consumable(type, hunger, thirst, pimples, sleep, energy, fat, health, coins, fitness) {
        consumed.type = type
        body.values.hunger += hunger
        body.values.thirst += thirst
        body.values.pimples += pimples
        if(sleep < 0 || body.info.features.substring(3,4)=="1")body.values.sleep += sleep
        body.values.energy += energy
        body.values.fat += fat
        body.values.health += health
        body.values.coins += coins
        body.values.fitness += fitness/body.values.fitness
    }

//listen///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(listen){ 
    if(body.info.action.substring(5, 6)=="0") { //not sleeping
        if(listen.includes("eatCalories:")) consumable("food", 20, 0, 15, 5, 20, 5, 0, 0, 0)
        if(listen.includes("dietPill:")) consumable("pills", 20, -20, 20, 20, -20, -10, 0, 0, -10)
        if(listen.includes("drinkCalories:")) consumable("drink", 0, 20, 10, -10, 20, 0, 0, 0, 0)
        if(listen.includes("cham_tea Calories:")) consumable("drink", 0, 10, -10, 20, 0, 0, 25, 0, 0)
        if(listen.includes("fruit Calories:")) consumable("food", 10, 0, 5, 0, 10, 2, 0, 0, 0)
        if(listen.includes("salad Calories:")) consumable("food", 10, 5, -20, 0, 10, 0, 0, 0, 0)
        if(listen.includes("coffee Calories:")) consumable("drink", 0, 5, 0, -25, 50, 0, 0, 0, 0)
        if(listen.includes("pimpleAlter")) consumable("item", 0, 0, -100, 0, 0, 0, 0, 0, 0)
        if(listen.includes("water Calories:")) consumable("drink", 0, 25, 0, 0, 0, 0, 0, 0, 0)
        if(listen.includes("fitness:")) consumable("action", -5, -5, 0, 5, -(body.values.fitness/10), 0, 0, 0, 10)
        if(listen.includes("yawn")) {
            body.values.sleep--
            body.response.sound = sound.play(body.info.voice, "yawn")
            body.response.anim = anims.stretch
        }
    }
    if(listen.includes("slapped!")) consumable("action", 0, 0, 0, -5, 0, 0, 0, 0, 0)
    if(listen.includes("slapping!")) consumable("action", 0, -5, 0, 0, -10, 0, 0, 0, 1)
    if(listen.includes("breathing")) body.response.sound = sound.play(body.info.voice, "breathing")
    //if(listen.includes("uncomfortable")) body.response.sound = sound.play(body.info.voice, "eww")
}

 //consumables//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 if(consumed.type != "food" && body.info.features.substring(2,3)=="1") {
    body.values.hunger-=0.07 //body.values.hunger loss when not eating
    //body.values.fat-=0.01 //body.values.fat loss when not eating
    body.values.pimples-=0.1
    if(body.values.hunger<25&&body.values.hunger>0) {
        let h = body.values.hunger.toFixed(1)
        h = h.substring(h.length - 1, h.length)
        if(h == "0") body.response.sound = sound.play(body.info.voice, "hungry")
        else if(h == "8") {
            body.response.sound = sound.play(body.info.voice, "rumble")
            body.response.anim = anims.hungry
        }
    }
}
if(consumed.type != "drink" && body.info.features.substring(2,3)=="1") {
    body.values.thirst-=0.1 //body.values.thirst loss when not drinking
    if(body.values.thirst<25&&body.values.thirst>0) {
        let t = body.values.thirst.toFixed(1)
        t = t.substring(t.length - 1, t.length)
        if(t == "5") {
            body.response.sound = sound.play(body.info.voice, "thisty")
            body.response.anim = anims.sweatwipe
        }
    }
}

if(consumed) { //consumed effects
    if(consumed.hunger) body.values.hunger+=consumed.hunger
    if(consumed.fat) body.values.fat+=consumed.fat
    if(consumed.pimples) body.values.pimples+=consumed.pimples
    if(consumed.energy) body.values.energy+=consumed.energy
    if(consumed.sleep && body.info.features.substring(3,4)=="1") body.values.sleep+=consumed.sleep
    if(consumed.thirst) body.values.thirst+=consumed.thirst
    if(consumed.health) body.values.health+=consumed.health
    if(consumed.coins) body.values.coins+=consumed.coins
    if(consumed.fitness) body.values.fitness+=consumed.fitness/body.values.fitness
}

return body
}