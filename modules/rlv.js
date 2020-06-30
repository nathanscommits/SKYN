const anims = require('../modules/anims')
const sound = require('../modules/sounds')
let essr_folder = "~SKYN ESSR DLC/"
function rlv(osay, method, file) {
    if(osay.substring(0,1) == "@") osay += ","+method+":"+essr_folder+"~"+file+"=force"
    else osay += "@"+method+":"+essr_folder+"~"+file+"=force"
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
	else if(body.values.sleep>=100 && body.info.action.substring(0, 1)=="0" && body.info.features.substring(3,4)=="1") {
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

    //sunburn
    if(body.state.timeInSun > 10 && body.state.timeInSun < 21 && body.state.sunburn != 1) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_sunburn002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_sunburn003")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_sunburn001")
        body.state.sunburn = 1
    } else if(body.state.timeInSun > 20 && body.state.timeInSun < 31 && body.state.sunburn != 2) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_sunburn001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_sunburn003")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_sunburn002")
        body.state.sunburn = 2
    } else if(body.state.timeInSun > 30 && body.state.sunburn != 3) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_sunburn001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_sunburn002")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_sunburn003")
        body.state.sunburn = 3
    } else if(body.state.timeInSun <=0 && body.state.sunburn != 0) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_sunburn001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_sunburn002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_sunburn003")
        body.state.sunburn = 0
    }

    //tan
    if(body.values.tan > 10 && body.values.tan < 21 && body.state.tan != 1) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_tan002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_tan003")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_tan001")
        body.state.tan = 1
    } else if(body.values.tan > 20 && body.values.tan < 31 && body.state.tan != 2) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_tan001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_tan003")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_tan002")
        body.state.tan = 2
    } else if(body.values.tan > 30 && body.state.tan != 3) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_tan001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_tan002")
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_tan003")
        body.state.tan = 3
    } else if(body.values.tan <=10 && body.values.tan >=0 && body.state.tan != 0) {
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_tan001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_tan002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_tan003")
        body.state.tan = 0
    }
    //pale
    else if(body.values.tan <0 && body.values.tan >=-10 && body.state.tan != 4) {
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_pale001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_pale002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_pale003")
        body.state.tan = 4
    } else if(body.values.tan <-10 && body.values.tan >=-20 && body.state.tan != 5) {
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_pale002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_pale001")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_pale003")
        body.state.tan = 5
    } else if(body.values.tan <-20 && body.state.tan != 6) {
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_pale003")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_pale002")
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_pale001")
        body.state.tan = 6
    }

    return body
}