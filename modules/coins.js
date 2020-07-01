const anims = require('../modules/anims')
const sound = require('../modules/sounds')
module.exports = function (body) {
    //coin finder
if(body.info.features=="111111" && body.info.coin_find == true) {
    let rand = 100 * Math.random() | 0
    if(rand<5) {
        body.values.coins += 100
        body.response.psay = "You found 100 coins just laying there!"
        body.response.pound= sound.play(body.info.voice, "coins")
    } 
}

 //coins
if(body.values.health>0 && body.info.features=="111111") {
    body.values.timeAlive+=2
    if(body.values.hunger>0) body.values.coins+=(body.values.hunger/10000)
    if(body.values.thirst>0) body.values.coins+=(body.values.thirst/10000)
    if(body.values.fitness>=100) body.values.coins+=(body.values.fitness/100000)
    if(body.values.energy<body.values.fitness) body.values.coins+=((body.values.fitness-body.values.energy)/1000000)
    if(body.values.sleep<100) body.values.coins+=((100-body.values.sleep)/100000)
    if(body.values.tan>0) body.values.coins+=(body.values.tan/10000)
    if(body.values.sunburn<=10) body.values.coins+=(body.values.tan/10000)
}

return body
}