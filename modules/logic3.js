function float2int (value) {
    return value | 0;
}

exports.values = function(body) {
    
    //////////REGION TIME
        let s_minutes
        let tod = float2int(body.info.timeOfDay*6)
        let hours = float2int(tod) / 3600
        let minutes = (tod / 60) - (float2int(hours) * 60)
        let s_hours = float2int(hours)
        s_minutes = float2int(minutes)
        if(hours<10) s_hours = "0"+float2int(hours)
        if(minutes<10) s_minutes = "0"+float2int(minutes)
        body.info.timeOfDay = s_hours+":"+s_minutes
        body.response.timeOfDay = body.info.timeOfDay
////////////////////
    if(body.info.features.substring(0,1)!="1") return; //all features on  
    if(body.info.features.substring(2,3)=="0") { //food is off
        ud.hunger+=2
        ud.thirst+=2
    }
    if(body.info.features.substring(3,4)=="0") ud.sleep-=2 //sleep is off
    if(body.info.features.substring(4,5)=="0") ud.energy+=100 //energy is off

    //coin finder
    if(body.info.features=="11111" && body.info.coin_find == true) {
        let rand = 100 * Math.random() | 0
        if(rand<5) {
            body.values.coins += 100
            response.psay = "You found 100 coins just laying there!"
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
        body.values.sleep += sleep
        body.values.energy += energy
        body.values.fat += fat
        body.values.health += health
        body.values.coins += coins
        body.values.fitness += fitness
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
        body.response.sound = playsound(body.info.voice, "breathing") //return queue here somehow too
    } else if(body.values.energy < body.values.fitness/4) {
        let chance = 100 * Math.random() | 0
        if(chance<10) {
            if(chance<5) body.response.anim = anims.sweatwipe
            else body.response.anim = anims.fanning[anims.fanning * Math.random() | 0]
        }
    }
    if(action.substring(0,5)=="00000") { //standing
        body.values.energy+=(body.values.fitness/100) //regain body.values.energy while idle
        body.values.fitness-=0.02 //passive body.values.fitness loss
    }
    if(body.values.energy<body.values.fitness) {
        body.values.fitness+=50/body.values.fitness //body.values.fitness gain when exercising, more body.values.fitness means harder to earn body.values.fitness
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
            if(listen.includes("fitness:")) consumable("action", -5, -5, 0, -5, -(body.values.fitness/10), 0, 0, 0, 10)
            if(listen.includes("yawn")) {
                body.values.sleep--
                body.response.sound = playsound(body.info.voice, "yawn")
                body.response.anim = anims.stretch
            }
        }
        if(listen.includes("slapped!")) consumable("action", 0, 0, 0, -5, 0, 0, 0, 0, 0)
        if(listen.includes("slapping!")) consumable("action", 0, -5, 0, 0, -10, 0, 0, 0, 1)
        if(listen.includes("breathing")) body.response.sound = playsound(body.info.voice, "breathing")
        //if(listen.includes("uncomfortable")) body.response.sound = playsound(body.info.voice, "eww")
    }

    //consumables//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if(consumed.type != "food" && body.info.features.substring(2,3)=="1") {
        body.values.hunger-=0.07 //body.values.hunger loss when not eating
        body.values.fat-=0.01 //body.values.fat loss when not eating
        body.values.pimples-=0.1
        if(body.values.hunger<25&&body.values.hunger>0) {
            let h = body.values.hunger.toFixed(1)
            h = h.substring(h.length - 1, h.length)
            if(h == "0") body.response.sound = playsound(body.info.voice, "hungry")
            else if(h == "8") {
                body.response.sound = playsound(body.info.voice, "rumble")
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
                body.response.sound = playsound(body.info.voice, "thisty")
                body.response.anim = anims.sweatwipe
            }
        }
    }
    
    if(consumed) { //consumed effects
        if(consumed.hunger) body.values.hunger+=consumed.hunger
        if(consumed.fat) body.values.fat+=consumed.fat
        if(consumed.pimples) body.values.pimples+=consumed.pimples
        if(consumed.energy) body.values.energy+=consumed.energy
        if(consumed.sleep) body.values.sleep+=consumed.sleep
        if(consumed.thirst) body.values.thirst+=consumed.thirst
        if(consumed.health) body.values.health+=consumed.health
        if(consumed.coins) body.values.coins+=consumed.coins
        if(consumed.fitness) body.values.fitness+=consumed.fitness
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
    if(body.values.pimples>=50 && !attached.includes("Pimples")) 
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_Pimples001")
    else if(body.values.pimples<50 && attached.includes("Pimples"))
        body.response.osay = rlv(body.response.osay, "detach", "SKYN_Pimples001")

    //sleep
    if(body.values.sleep>=75 && body.values.sleep<100 && !attached.includes("sleep")) {
        body.response.osay = rlv(body.response.osay, "attachover", "SKYN_sleep001")
        body.response.sound = playsound(body.info.voice, "yawn")
        body.response.csay = "yawn"
	}
	else if(body.values.sleep<75 && attached.includes("sleep"))
         body.response.osay = rlv(body.response.osay, "detach", "SKYN_sleep001")
	else if(body.values.sleep>=100 && action.substring(0, 1)=="0") {
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
        } else if (body.states.sweatSwitch!=0 && body.values.energy>=body.values.fitness)  {
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
            body.response.sound = playsound(body.info.voice, "snore")
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
        body.values.deathCount++
        body.values.timeAlive=0
        body.values.coins-=(body.values.coins/10)
        body.values.health=100
        body.values.hunger=100
        body.values.thirst=100
        body.values.sleep=0
        if(body.response.osay.substring(0,1) == "@") body.response.osay += ",sit:00000000-0000-0000-0000-000000000000=force"
        else body.response.osay += "@sit:00000000-0000-0000-0000-000000000000=force"
        body.response.anim = anims.death
        body.response.death = "true"
        body.response.sound = playsound(body.info.voice, "dieing")
    } if(body.values.health<25 && body.info.features.substring(0,1)=="1")
        body.response.sound = playsound(body.info.voice, "low health")

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

let anims = {}
anims.sleeps = [
    "Sleep_01_anim",
    "Sleep_02_anim",
    "Sleep_03_anim",
    "Sleep_04_anim",
]
anims.death = "Death_NoLoop"
anims.csleeps = "Sleeping_Chair_loop"
anims.stretch = "Stretch"
anims.exhausted = "Exhausted_NoLoop"
anims.standsleep = "drowsyStanding_WIP_noloop"
anims.breathing = "HeavyBreathing_WIP_noloop"
anims.fanning = [
    "Hot_Fanning_One_WIP_noloop",
    "Hot_Fanning_One_INVERT_noloop",
    "Hot_Fanning_Both_WIP_noloop",
    "Hot_Fanning_Both_Version2_noloop",
    "Hot_Fanning_Both_NoSync"
]
anims.sweatwipe = "Sweat_Wipe_WIP_noloop"
anims.hungry = "Hungry_WIP_noloop"

function playsound(voice, sound)
{
    let sounds = []
    if(voice==0||voice==3) return ""
	else if(voice==1) { //Masculine voice sounds
		if(sound == "breathing") {
			sounds = ["33c919c8-d967-69e1-12e9-6c0d69a81edf",
			"5eefe67a-c7e8-5d5c-014a-f9723add357a",
			"48becf2e-1344-b3c1-2d53-ca503794ce83",
			"0c683661-f98b-f5cb-8728-9d498cea33bb"]
			//queue = 1
		}
		else if(sound=="eww") sounds=["4c95084f-a708-1675-06d7-202dd40dc368",
            "d37f4d54-85d4-9c04-0934-8eb368624207",
            "ad358d99-d2c0-8cb4-6cc5-678372f1f6aa",
            "6a11ee47-7588-4864-aeae-3c0da86ac2e0"]
		else if(sound=="hungry") {
			sounds=["3e961daa-cb2b-051a-3715-f6e047d1488b",
			"465de504-0a7e-ff53-9b3b-68ed097ee5ef",
			"a7cbf4f7-fd14-3d4e-ff13-a4191f7e4e89",
			"a7cbf4f7-fd14-3d4e-ff13-a4191f7e4e89"]
			//queue = 1
		}
		else if(sound=="snore") {
			sounds=["270ae083-57ab-7995-45a1-f95e8228e21d",
			"41660ca1-d6c3-7fc3-9b93-61587c3daf71",
            "adf4b6c4-0bf8-9960-2c29-0e6cfe4fc576",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f",
            "adf4b6c4-0bf8-9960-2c29-0e6cfe4fc576",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f"
        	]
			//queue = 1
		}
		else if(sound=="yawn") sounds=["7bbe5343-3e31-5f75-abde-3649df4c97d1",
            "17465d8e-5a01-0500-58f3-312fff74eb14",
            "1b088bdc-5dc6-829c-cb97-9d353bc43bf2"]
		else if(sound=="burp") sounds=["c8ad8ddb-687d-29d1-7e06-850838bd10a1",
		    "2516f9f3-9f9a-8cf1-aee6-7e75c1c1e9f0"]
		else if(sound=="thirsty") sounds=["a150de07-a7b2-ac7b-825c-075c5570a086",
            "ce3ea3eb-9d8c-f415-269d-14218d9f4e93",
            "27350e7d-16cf-361a-715c-9babb56875ce",
            "ab86eb09-5808-1bf3-cd78-a57d30240b1f",
            "9d81e8a6-b373-13ab-9869-b4dd9cfd81a4"]
		else if(sound=="drowning") {
			 sounds=["c05803c1-bcf1-cb15-6dac-b27fffc80f55",
			"777ef6cc-ee80-6919-c977-790b477e0fc6"]
			//queue = 1
		}
		else if(sound=="drowningDeath") sounds=["960223a8-ee61-39ef-c37c-0ce2109eae06",
		    "8d0a6593-d88e-41c3-53f6-854657949e71"]
	}
	else if(voice==2) { //fem voice sounds
		if(sound == "breathing") {
			sounds = ["1d6934ab-7c01-c2e7-0b45-78a65b9531bb"]
			//queue = 1
		}
		else if(sound=="eww") sounds=["4b05ad88-a2e7-bc70-1b4c-218ef1a16cfb","b8cb16e0-f178-7a7a-3910-e17268e5bc2a","c90caad8-83ff-f704-b215-19f3cc7789c9"]
		else if(sound=="hungry") {
			sounds=["df995169-0f35-9af0-ce1f-96693af2367b",
			"c90caad8-83ff-f704-b215-19f3cc7789c9",
			"b8cb16e0-f178-7a7a-3910-e17268e5bc2a",
			"5881052b-26ab-84f7-fdd3-706254ba3804"]
			//queue = 1
		}
		else if(sound=="snore") {
            sounds=["0de41a89-d565-db61-87c9-eabb57403450",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f",
            "d1e83b54-cc26-d069-f950-a04e4f94fe1f"]
			//queue = 1
		}
		else if(sound=="yawn")sounds=["b731237a-79f0-8ad6-b6b7-3afee9476945",
            "81751903-71e3-3c3c-2e9f-c8979bec1e4c",
            "f5106d2b-538a-2c11-dcb2-d3487dc2297a"]
		else if(sound=="burp") sounds=["e006cdf8-47b0-4bc2-c109-91bf6daf4c03",
            "73d6388b-9ef1-a908-03a0-d4360d8e9163",
            "acb57314-00d2-6670-f5c7-d9a973a70f49"]
 		if(sound=="thirsty")sounds=["12eebb84-efdb-6764-bf55-3ef108e74a30",
            "906e962f-f0fd-d5c8-4d2d-f808f43b47f4"]
        else if(sound=="drowning") {
        	sounds=["e5a80866-cea8-1ed4-72bc-5ba8ea6c760c"]
        	//queue = 1
        }
		else if(sound=="drowningDeath") sounds=["e4b0933c-99c6-4ef8-7d6f-367973c13277"]
	}

	if(sound=="drowning") sounds=["7faa816c-e66d-7439-85be-82635847d416","87549ea0-e1eb-1512-af13-1441ecc6eb23"]
	if(sound=="sizzle") sounds=["27670beb-bdc2-9329-96e0-f9d66b7f76a8","d6a9764c-9ccb-d969-9d76-0ee2f53e7a6c"]

	if(sound=="walksplash")sounds=["fe47983d-197b-d6cd-b3e3-33b57b2acd1b",
        "bc189a9b-153f-4299-eeda-d2af7e51e055",
        "f049cf87-d065-2f38-f9c1-998a4d9e19ca",
        "00bedfd2-46e2-3464-a881-025e35e19a96",
        "e99017f9-63c3-1099-1170-ea264d6d1d97",
        "4fd0044e-f0ab-eb5a-d5d0-a2729f5c35c6",
        "3521bd83-7293-910e-f3eb-0fe029e40c2f"]
	if(sound=="splashSoft") sounds=["b92945f4-2128-cbf7-9e00-8bc2493e265b",
        "61384672-d275-f039-b6d9-4179b6347538",
        "5ad57c25-6403-f32e-ab98-54079d52e9e5",
        "5d915dc1-7a52-4089-3a67-2642209b8d4b"]
	if(sound=="splash") sounds=["ed4a01d4-e2ab-7d3f-b67c-44221a0b5815",
        "3da9aef0-6579-d640-650f-406c4cbb8d6a",
        "1f212e30-6ca8-870b-6923-7de1934e97ae",
        "0657afc4-14d4-356a-cfc3-464e65d04977",
        "67def690-7b38-586c-0e8e-2b4016680438",
        "95f3b566-2fff-a7cb-2c7e-33b22743b2d0",
        "762918aa-bafb-a798-9b42-39d0a628f837",
        "a7931ecf-4328-c4d0-b59b-4c431fc61bbb",
        "c6cb4385-b7a0-3a5f-703f-8b743b23e233",
        "0aa1e457-d290-26b3-86b7-c5905d01f1cd",
        "3332ec78-0e3d-7750-319f-6625e374c287",
        "56a94a0d-bd1d-3ae0-ee7f-06ec982303c5",
        "adb42488-7429-b0ba-eaf3-23f391ca61ce",
        "161a1f60-ce37-4292-8c73-2864aaf23f1a",
        "e5754747-5227-9108-a68d-0c94dd4189f0",
        "7c7b3cbe-ac47-8622-9c90-ca806d40d847"]

	if(sound=="rumble")sounds=["95c9d0f6-da44-b19b-c4b5-bb97c8f6baa3",
        "2b794dc5-33c0-58e1-94a2-f2933e564728",
        "3a002595-915c-5957-ff25-36b58a8e37b2"]

    if(sound=="dieing") sounds=["7a17a826-de7a-241a-f840-05c32ac26399"]
    if(sound=="low health") {
        sounds=["10ea379e-38ed-86f6-9f58-27cf6315b5c6"]
        //queue = 1
    }

    
   return sounds[sounds.length * Math.random() | 0]
}