const { response } = require("express");
const anims = require('../modules/anims')
const sound = require('../modules/sounds')
const time = require('../modules/region_time')
const objects = require('../modules/objects')
function float2int (value) {
    return value | 0;
}

exports.values = function(body) {

body = time(body) //get region time
body = objects(body) //get nearby relevant objects

    if(body.info.features.substring(0,1)!="1") return; //all features on  
    if(body.info.features.substring(2,3)=="0") { //food is off
        if(body.values.hunger<=0)body.values.hunger++
        if(body.values.thirst<=0)body.values.thirst++
    }
    if(body.info.features.substring(3,4)=="0") {
         if(body.values.sleep>=99)body.values.sleep-=2 //sleep is off
    }
    if(body.info.features.substring(4,5)=="0") body.values.energy+=100 //energy is off

    //coin finder
    if(body.info.features=="11111" && body.info.coin_find == true) {
        let rand = 100 * Math.random() | 0
        if(rand<5) {
            body.values.coins += 100
            body.response.psay = "You found 100 coins just laying there!"
            body.response.pound= sound.play(body.info.voice, "coins")
        } 
    }  
    //body.response.queue = ""
    //console.log(body)
    let essr_folder = "~SKYN ESSR DLC/"
    let consumed = body.info.consumed
    let listen = body.info.listen
    let attached = body.info.attached
    let action = body.info.action
    body.response.osay = ""
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
    function rlv(osay, method, file) {
        if(osay.substring(0,1) == "@") osay += ","+method+":"+essr_folder+"~"+file+"=force"
        else osay += "@"+method+":"+essr_folder+"~"+file+"=force"
        return osay
    }

    if(action.substring(5, 6)=="0") { //not sleeping
        if(attached.includes("SKYN_SleepParticles")) {
            body.response.osay = rlv(body.response.osay, "detach", "SKYN_SleepParticles")
            body.response.loop = "endAnim"
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
    if(body.values.energy<body.values.fitness) {
        body.values.fitness += 100/body.values.fitness //fitness gain when exercising, more fitness means harder to earn fitness
        body.values.fat-=0.1
    }
    //if(action.substring(5, 5)==1) //underwater
    //if(action.substring(6, 6)==1) //in sun
  
    //listen///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if(listen){ 
        if(action.substring(5, 6)=="0") { //not sleeping
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

    //body.values.health
    if(body.values.hunger<=0) body.values.health-=1
    if(body.values.thirst<=0) body.values.health-=1
    else if(body.values.hunger>0) body.values.health+=1 //passive body.values.health regain

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //shape
    let shape_changed = body.values.shape
    if(body.values.fat<12 && body.values.shape!=1) // Super Skinny
        body.values.shape=1
    else if(body.values.fat>=12 && body.values.fat<25 && body.values.shape!=2) // Skinny
        body.values.shape=2
    else if(body.values.fat>=25 && body.values.fat<37 && body.values.shape!=3) // Average SKinny
        body.values.shape=3
    else if(body.values.fat>=37 && body.values.fat<62 && body.values.shape!=4) // Average
        body.values.shape=4
    else if(body.values.fat>=62 && body.values.fat<75 && body.values.shape!=5) // Average body.values.fat
        body.values.shape=5
    else if(body.values.fat>=75 && body.values.fat<87 && body.values.shape!=6) // body.values.fat
        body.values.shape=6
    else if(body.values.fat>=87 && body.values.shape!=7) // super body.values.fat
        body.values.shape=7
    if(shape_changed!=body.values.shape)
        if(body.response.osay.substring(0,1) == "@") body.response.osay += ",attach:"+essr_folder+"Weight00" + body.values.shape + "=force"
        else body.response.osay += "@attach:"+essr_folder+"Weight00" + body.values.shape + "=force"

    //pimples
    if(body.values.pimples>=50 && body.states.pimples !=1) {
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Pimples001")
        body.states.pimples = 1
    }
    else if(body.values.pimples<50 && body.states.pimples !=0) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pimples001")
        body.states.pimples = 0
    }

    //sleep
    if(body.values.sleep>=75 && body.values.sleep<100 && body.states.sleeping !=1) {
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_sleep001")
        body.response.sound = sound.play(body.info.voice, "yawn")
        body.response.csay = "yawn"
        body.states.sleeping =1
	}
	else if(body.values.sleep<75 && body.states.sleeping !=0) {
         body.response.osay = rlv(body.response.osay, "detach", "SKYN_sleep001")
         body.states.sleeping =0
    }
	else if(body.values.sleep>=100 && action.substring(0, 1)=="0" && body.info.features.substring(3,4)=="1") {
		if(body.response.osay.substring(0,1) == "@") body.response.osay += ",sit:00000000-0000-0000-0000-000000000000=force"
        else body.response.osay += "@sit:00000000-0000-0000-0000-000000000000=force"
    }
    
    //sweat
    if(body.info.features.substring(1,2)=="1") { //sweat is off
        if(body.states.sweatSwitch!=1 && body.values.energy<=((body.values.fitness/4)*3) && body.values.energy>(body.values.fitness/2)) {
            if(body.response.osay.substring(0,1) == "@") body.response.osay += ",detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat003=force,attachover:"+essr_folder+"~SKYN_Sweat001=force"
            else body.response.osay += "@detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat003=force,attachover:"+essr_folder+"~SKYN_Sweat001=force"
            body.states.sweatSwitch=1
        } else if(body.states.sweatSwitch!=2 && body.values.energy>(body.values.fitness/4) && body.values.energy<=(body.values.fitness/2)) {
            if(body.response.osay.substring(0,1) == "@") body.response.osay += ",detach:"+essr_folder+"~SKYN_Sweat001=force,detach:"+essr_folder+"~SKYN_Sweat003=force,attachover:"+essr_folder+"~SKYN_Sweat002=force"
            else body.response.osay += "@detach:"+essr_folder+"~SKYN_Sweat001=force,detach:"+essr_folder+"~SKYN_Sweat003=force,attachover:"+essr_folder+"~SKYN_Sweat002=force"
            body.states.sweatSwitch=2
        } else if(body.states.sweatSwitch!=3 && body.values.energy<=(body.values.fitness/4)) {
            if(body.response.osay.substring(0,1) == "@")  body.response.osay += ",detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat001=force,attachover:"+essr_folder+"~SKYN_Sweat003=force"
            else body.response.osay += "@detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat001=force,attachover:"+essr_folder+"~SKYN_Sweat003=force"
            body.states.sweatSwitch=3
        } else if (body.states.sweatSwitch!=0 && body.values.energy>=body.values.fitness-10)  {
            body.states.sweatSwitch=0
            if(body.response.osay.substring(0,1) == "@") body.response.osay += ",detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat001=force,detach:"+essr_folder+"~SKYN_Sweat003=force"
            else body.response.osay += "@detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat001=force,detach:"+essr_folder+"~SKYN_Sweat003=force"
        }
    }
    
    if(body.states.fatigueSwitch!=1 && body.values.energy<=0) {
        if(body.response.osay.substring(0,1) == "@") body.response.osay += ",fly=n,temprun=n,alwaysrun=n"
        else body.response.osay += "@fly=n,temprun=n,alwaysrun=n"
        body.states.fatigueSwitch=1
    }
    else if(body.states.fatigueSwitch!=2 && body.values.energy>(body.values.energy/8)) {
        if(body.response.osay.substring(0,1) == "@") body.response.osay += ",fly=y,temprun=y,alwaysrun=y"
        else body.response.osay += "@fly=y,temprun=y,alwaysrun=y"
        body.states.fatigueSwitch=2
    }

    if(action.substring(0, 1)=="1") { //sitting
        body.values.energy+=(body.values.fitness/50) //resting
        if(parseInt(action.substring(5, 6))>=1) { //sleeping on ground =1 on object =2
            body.values.sleep--
            body.values.energy+=(body.values.fitness/20) //resting even more
            body.response.sound = sound.play(body.info.voice, "snore")
            //particles
            if(!attached.includes("SKYN_SleepParticles")) {
                body.response.osay = rlv(body.response.osay, "attachover", "SKYN_SleepParticles")
                if(action.substring(5,6)=="1") //ground sleeping
                    body.response.loop = anims.sleeps[anims.sleeps.length * Math.random() | 0]
                else //chair sleeping
                    body.response.loop = anims.csleeps
            }   
        } else //sitting but not sleeping
            body.values.sleep+=0.05 //get body.values.sleepy if not body.values.sleeping while sitting
    }
    else // not sitting
        body.values.sleep+=0.1 //not sitting, sleepy! you could do 1/energy to make it based off of energy loss

    //body.values.coins
    if(body.values.health>0 && body.info.features=="11111") {
        body.values.timeAlive+=2
        if(body.values.hunger>0) body.values.coins+=(body.values.hunger/10000)
        if(body.values.thirst>0) body.values.coins+=(body.values.thirst/10000)
        if(body.values.fitness>=100) body.values.coins+=(body.values.fitness/100000)
        if(body.values.energy<body.values.fitness) body.values.coins+=((body.values.fitness-body.values.energy)/1000000)
        if(body.values.sleep<100) body.values.coins+=((100-body.values.sleep)/100000)
    } else if(body.values.health <= 0) { //dieing
        let deathMessage = [
            "Second death is not the opposite of second life, but a part of it.",
            "We all die. The goal isn’t to live forever, the goal is to rez something that will.",
            "You were DROP DEAD gorgeous!",
            "Something smells dead over here...",
            "That outfit is to die for!",
            "That it will never come again is what makes life so sweet. Respawning...",
            "Don't troll the respawn, Jeremy!",
            "Did you fall from a skybox? Because you look like an angel.",
            "No one is actually dead until all their objects have been auto returned.",
            "You've made a GRAVE mistake!",
            "You put the fun back in funeral!",
            "Why do ghosts ride the elevator? To lift their spirits.",
            "Cremation is your last hope for a smoking hot body.",
            "Don't feel bad, I'm usually about to die.",
            "Here lies "+body.name+", a free elf.",
            "Death, griefers and group chats! There's never any convenient time for any of them.",
            "Mesh's to mesh's, prim to prim.",
            "I don't think of it as dieing, I think of it as going to the big lost and found folder in the sky.",
            "Corn nuts!",
            "Clever girl...",
            "No, not the bees! NOT THE BEES! AAAAAAAAGH!",
            "It’s been a funny sort of day, hasn’t it?",
            "I’ll see you in another life. When we are both cats."
        ]
        let timeAliveString = float2int(body.values.timeAlive/60)+" minutes"
        if(body.values.timeAlive > 3600) timeAliveString = float2int(body.values.timeAlive/3600)+" hours"
        body.response.psay = "You died!\nYou made it "+timeAliveString+".\nYou lost "+float2int(body.values.coins/10)+' SKYN Coins!\n \"'+deathMessage[deathMessage.length * Math.random() | 0]+'\"'
        
        body.values.deathCount++
        body.values.timeAlive=0
        body.values.coins =  body.values.coins - (body.values.coins/10)
        body.values.health=100
        body.values.hunger=100
        body.values.thirst=100
        body.values.sleep=0
        if(body.response.osay.substring(0,1) == "@") body.response.osay += ",sit:00000000-0000-0000-0000-000000000000=force"
        else body.response.osay += "@sit:00000000-0000-0000-0000-000000000000=force"
        body.response.anim = anims.death
        body.response.death = "true"
        body.response.sound = sound.play(body.info.voice, "dieing")
        
    } if(body.values.health<25 && body.info.features.substring(0,1)=="1")
        body.response.pound = sound.play(body.info.voice, "low health")

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

    return body
}


