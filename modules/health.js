const anims = require('../modules/anims')
const sound = require('../modules/sounds')
function float2int (value) {
    return value | 0;
}
module.exports = function (body) {
    //body.values.health
    if(body.values.hunger<=0) body.values.health-=1
    if(body.values.thirst<=0) body.values.health-=1
    if(body.values.oxygen<=0) {
        body.values.health-=1
        body.response.anim = anims.drowning
    }
    else if(body.values.hunger>0) body.values.health+=1 //passive body.values.health regain
    
    if(body.values.health <= 0) { //dieing
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

    return body
}