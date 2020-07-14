const anims = require('../modules/anims')
const sound = require('../modules/sounds')
let rlv_folder = "~SKYN_HUD/"
function rlv(osay, method, file) {
    if(osay.substring(0,1) == "@") osay += ","+method+":"+rlv_folder+"~"+file+"=force"
    else osay += "@"+method+":"+rlv_folder+"~"+file+"=force"
    return osay
}
module.exports = function(body) {
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
        if(body.response.osay.substring(0,1) == "@") body.response.osay += ",attach:"+rlv_folder+"Weight00" + body.values.shape + "=force"
        else body.response.osay += "@attach:"+rlv_folder+"Weight00" + body.values.shape + "=force"

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
    if(body.values.sleep>=75 && body.values.sleep<100 && body.states.tired !=1) {
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_sleep001")
        body.response.sound = sound.play(body.info.voice, "yawn")
        body.response.csay = "yawn"
        body.states.tired =1
	}
	else if(body.values.sleep<75 && body.states.tired !=0) {
         body.response.osay = rlv(body.response.osay, "detach", "SKYN_sleep001")
         body.states.tired =0
    }
	else if(body.values.sleep>=100 && body.info.action.substring(0, 1)=="0" && body.info.features.substring(3,4)=="1") {
		if(body.response.osay.substring(0,1) == "@") body.response.osay += ",sit:00000000-0000-0000-0000-000000000000=force"
        else body.response.osay += "@sit:00000000-0000-0000-0000-000000000000=force"
    }
    
    //sweat
    if(body.info.features.substring(1,2)=="1") { //sweat is off
        if(body.states.sweatSwitch!=1 && body.values.energy<=((body.values.fitness/4)*3) && body.values.energy>(body.values.fitness/2)) {
            if(body.response.osay.substring(0,1) == "@") body.response.osay += ",detach:"+rlv_folder+"~SKYN_Sweat002=force,detach:"+rlv_folder+"~SKYN_Sweat003=force,attachover:"+rlv_folder+"~SKYN_Sweat001=force"
            else body.response.osay += "@detach:"+rlv_folder+"~SKYN_Sweat002=force,detach:"+rlv_folder+"~SKYN_Sweat003=force,attachover:"+rlv_folder+"~SKYN_Sweat001=force"
            body.states.sweatSwitch=1
        } else if(body.states.sweatSwitch!=2 && body.values.energy>(body.values.fitness/4) && body.values.energy<=(body.values.fitness/2)) {
            if(body.response.osay.substring(0,1) == "@") body.response.osay += ",detach:"+rlv_folder+"~SKYN_Sweat001=force,detach:"+rlv_folder+"~SKYN_Sweat003=force,attachover:"+rlv_folder+"~SKYN_Sweat002=force"
            else body.response.osay += "@detach:"+rlv_folder+"~SKYN_Sweat001=force,detach:"+rlv_folder+"~SKYN_Sweat003=force,attachover:"+rlv_folder+"~SKYN_Sweat002=force"
            body.states.sweatSwitch=2
        } else if(body.states.sweatSwitch!=3 && body.values.energy<=(body.values.fitness/4)) {
            if(body.response.osay.substring(0,1) == "@")  body.response.osay += ",detach:"+rlv_folder+"~SKYN_Sweat002=force,detach:"+rlv_folder+"~SKYN_Sweat001=force,attachover:"+rlv_folder+"~SKYN_Sweat003=force"
            else body.response.osay += "@detach:"+rlv_folder+"~SKYN_Sweat002=force,detach:"+rlv_folder+"~SKYN_Sweat001=force,attachover:"+rlv_folder+"~SKYN_Sweat003=force"
            body.states.sweatSwitch=3
        } else if (body.states.sweatSwitch!=0 && body.values.energy>=body.values.fitness-10)  {
            body.states.sweatSwitch=0
            if(body.response.osay.substring(0,1) == "@") body.response.osay += ",detach:"+rlv_folder+"~SKYN_Sweat002=force,detach:"+rlv_folder+"~SKYN_Sweat001=force,detach:"+rlv_folder+"~SKYN_Sweat003=force"
            else body.response.osay += "@detach:"+rlv_folder+"~SKYN_Sweat002=force,detach:"+rlv_folder+"~SKYN_Sweat001=force,detach:"+rlv_folder+"~SKYN_Sweat003=force"
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

    //sunburn 1200 seconds = 20 mins
    if(body.states.timeInSun > 250 && body.states.timeInSun < 500 && body.states.sunburn != 1) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Sunburn002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Sunburn003")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Sunburn001")
        body.states.sunburn = 1
    } else if(body.states.timeInSun >= 500 && body.states.timeInSun < 750 && body.states.sunburn != 2) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Sunburn001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Sunburn003")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Sunburn002")
        body.states.sunburn = 2
    } else if(body.states.timeInSun >= 750 && body.states.sunburn != 3) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Sunburn001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Sunburn002")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Sunburn003")
        body.states.sunburn = 3
    } else if(body.states.timeInSun <=0 && body.states.sunburn != 0) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Sunburn001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Sunburn002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Sunburn003")
        body.states.sunburn = 0
    }

    //tan
    if(body.values.tan > 10 && body.values.tan <= 40 && body.states.tan != 1) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Tan002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Tan003")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Tan001")
        body.states.tan = 1
    } else if(body.values.tan > 40 && body.values.tan <= 70 && body.states.tan != 2) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Tan001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Tan003")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Tan002")
        body.states.tan = 2
    } else if(body.values.tan > 70 && body.states.tan != 3) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Tan001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Tan002")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Tan003")
        body.states.tan = 3
    } else if(body.values.tan <=10 && body.values.tan >=-10 && body.states.tan != 0) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Tan001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Tan002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Tan003")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pale001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pale002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pale003")
        body.states.tan = 0
    }
    //pale
    else if(body.values.tan <-10 && body.values.tan >=-40 && body.states.tan != 4) {
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Pale001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pale002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pale003")
        body.states.tan = 4
    } else if(body.values.tan <-40 && body.values.tan >=-70 && body.states.tan != 5) {
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Pale002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pale001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pale003")
        body.states.tan = 5
    } else if(body.values.tan <-70 && body.states.tan != 6) {
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Pale003")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pale002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pale001")
        body.states.tan = 6
    }

    //wet
    if(body.states.wet>100 && body.states.dry !=3){
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Wet003")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Wet002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Wet001")
        body.states.dry = 3
    } else if(body.states.wet>50 && body.states.wet<=100 && body.states.dry !=2){
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Wet002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Wet003")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Wet001")
        body.states.dry = 2
    } else if(body.states.wet>0 && body.states.wet<=50 && body.states.dry !=1){
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Wet001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Wet003")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Wet002")
        body.states.dry = 1
    } else if(body.states.wet<=0 && body.states.dry !=0){
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Wet001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Wet003")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Wet002")
        body.states.dry = 0
    }

    return body
}