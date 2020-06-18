function rlv(osay, method, file){
    if(osay.substring(0,1) == "@") osay += ","+method+":"+essr_folder+"~"+file+"=force"
    else osay += "@"+method+":"+essr_folder+"~"+file+"=force"
    this.body.response.osay = osay
}

function action(body){
    let action = body.info.action
    let ud = body.values

    if(action.substring(5, 6)=="0" && body.info.attached.includes("SKYN_SleepParticles")) //not sleeping
        rlv(body.response.osay, "detach", "SKYN_SleepParticles")
    
    if(action.substring(1, 2)=="1") ud.energy-=8; //flying
    if(action.substring(2, 3)=="1") ud.energy-=4; //running
    if(action.substring(3, 4)=="1") ud.energy-=2; //walking/running
    if(action.substring(4, 5)=="1") ud.energy-=8; //jumping
    if(action.substring(0,5)=="00000") { //standing
        ud.energy+=(ud.fitness/100); //regain ud.energy while idle
        ud.fitness-=0.02; //passive ud.fitness loss
    }
    
    //if(action.substring(5, 5)==1) //underwater
    //if(action.substring(6, 6)==1) //in sun
    return ud
}

function playanim (x) {
    this.body.response.anim += x
}

function plays (ud) {
    if(ud.energy<=0){
        playanim(anims.exhausted)
        playsound("breathing")
    }
    else if(ud.energy < ud.fitness/4) {
        let chance = 100 * Math.random() | 0
        if(chance<10) {
            if(chance<5) playanim(anims.sweatwipe)
            else playanim(anims.fanning[anims.fanning * Math.random() | 0])
        }
    }
}

let essr_folder = "~SKYN ESSR DLC/"

exports.values = function(body) {
    let listen = body.listen
    let attached = body.attached
    body.values = action(body);
    body.response = plays(body.values);

    /////////////////////////////////////////////////////////////////////////energy
    
    if(ud.energy<ud.fitness)
    {
        ud.fitness+=50/ud.fitness; //ud.fitness gain when exercising, more ud.fitness means harder to earn ud.fitness
        ud.fat-=0.1;
    }
/////////////////////////////////////////////////////////////////consumed/////////////////////////////////////////////////////////////////////////////////
    let consumed = body.info.consumed
    function consumable(type, hunger, thirst, pimples, sleep, energy, fat, health, coins, fitness) {
        consumed.type = type
        ud.hunger += hunger
        ud.thirst += thirst
        ud.pimples += pimples
        ud.sleep += sleep
        ud.energy += energy
        ud.fat += fat
        ud.health += health
        ud.coins += coins
        ud.fitness += fitness
    }
    
    //listen
    if(listen)
    {
        if(action.substring(5, 6)=="0") //not sleeping
        {
            if(listen.includes("eatCalories:")) consumable("food", 20, 0, 15, 5, 20, 5, 0, 0, 0);
            if(listen.includes("dietPill:")) consumable("pills", 20, -20, 20, 20, -20, -10, 0, 0, -10);
            if(listen.includes("drinkCalories:")) consumable("drink", 0, 20, 10, -10, 20, 0, 0, 0, 0);
            if(listen.includes("cham_tea Calories:")) consumable("drink", 0, 10, -10, 20, 0, 0, 25, 0, 0);
            if(listen.includes("fruit Calories:")) consumable("food", 10, 0, 5, 0, 10, 2, 0, 0, 0);
            if(listen.includes("salad Calories:")) consumable("food", 10, 5, -20, 0, 10, 0, 0, 0, 0);
            if(listen.includes("coffee Calories:")) consumable("drink", 0, 5, 0, -25, 50, 0, 0, 0, 0);
            if(listen.includes("pimpleAlter")) consumable("item", 0, 0, -100, 0, 0, 0, 0, 0, 0);
            if(listen.includes("water Calories:")) consumable("drink", 0, 25, 0, 0, 0, 0, 0, 0, 0);
            if(listen.includes("fitness:")) consumable("action", -5, -5, 0, -5, -(ud.fitness/10), 0, 0, 0, 10);
        }
        if(listen.includes("slapped!")) consumable("action", 0, 0, 0, -5, 0, 0, 0, 0, 0);
        if(listen.includes("slapping!")) consumable("action", 0, -5, 0, 0, -10, 0, 0, 0, 1);
        if(listen.includes("breathing")) body.response.sound = playsound(ud.voice, "breathing")
        if(listen.includes("uncomfortable")) body.response.sound = playsound(ud.voice, "eww")
    }

    if(consumed) //consumed effects
    {
        if(consumed.hunger) ud.hunger+=consumed.hunger
        if(consumed.fat) ud.fat+=consumed.fat
        if(consumed.pimples) ud.pimples+=consumed.pimples
        if(consumed.energy) ud.energy+=consumed.energy
        if(consumed.sleep) ud.sleep+=consumed.sleep
        if(consumed.thirst) ud.thirst+=consumed.thirst
        if(consumed.health) ud.health+=consumed.health
        if(consumed.coins) ud.coins+=consumed.coins
        if(consumed.fitness) ud.fitness+=consumed.fitness
    }


    //consumables
    if(consumed.type != "food" && body.features.substring(2,3)=="1") 
    {
        ud.hunger-=0.07; //ud.hunger loss when not eating
        ud.fat-=0.01; //ud.fat loss when not eating
        ud.pimples-=0.1;
        if(ud.hunger<25&&ud.hunger>0)
        {
            let h = ud.hunger.toFixed(1)
            h = h.substring(h.length - 1, h.length)
            if(h == "0")
            {
                response.sound = playsound(ud.voice, "hungry")
            }
            else if(h == "8")
            {
                response.sound = playsound(ud.voice, "rumble")
                response.anim = anims.hungry
            }
        }
    }
    if(consumed.type != "drink" && body.features.substring(2,3)=="1")
    {
        ud.thirst-=0.1; //ud.thirst loss when not drinking

        if(ud.thirst<25&&ud.thirst>0)
        {
            let t = ud.thirst.toFixed(1)
            t = t.substring(t.length - 1, t.length)
            if(t == "5")
            {
                response.sound = playsound(ud.voice, "thisty")
                response.anim = anims.sweatwipe
            }
        }
    }
    
    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ud.health
if(ud.hunger<=0) ud.health-=1
if(ud.thirst<=0) ud.health-=1
else if(ud.hunger>0) ud.health+=1 //passive ud.health regain
    //RLV commands

    //shape
    let shape_changed = ud.shape;
    if(ud.fat<12 && ud.shape!=1) // Super Skinny
        ud.shape=1;
    else if(ud.fat>=12 && ud.fat<25 && ud.shape!=2) // Skinny
        ud.shape=2;
    else if(ud.fat>=25 && ud.fat<37 && ud.shape!=3) // Average SKinny
        ud.shape=3;
    else if(ud.fat>=37 && ud.fat<62 && ud.shape!=4) // Average
        ud.shape=4;
    else if(ud.fat>=62 && ud.fat<75 && ud.shape!=5) // Average ud.fat
        ud.shape=5;
    else if(ud.fat>=75 && ud.fat<87 && ud.shape!=6) // ud.fat
        ud.shape=6;
    else if(ud.fat>=87 && ud.shape!=7) // super ud.fat
        ud.shape=7;
    if(shape_changed!=ud.shape)
        rlv("attach","Weight00"+ud.shape)

    //pimples
    if(ud.pimples>=50 && ud.pimpleStage!=2) //could check if wearing pimples instead of using puimplesstage
    {
        rlv("attachover", "SKYN_Pimples001")
        ud.pimpleStage=2;
    }
    else if(ud.pimples<50 && ud.pimpleStage!=1)
    {
        rlv("detach", "SKYN_Pimples001")
        ud.pimpleStage=1;
    }

    //sleep
    if(ud.sleep>=75 && ud.sleep<100 && ud.sleepSwitch!=2)
	{
        rlv("attachover", "SKYN_sleep001")
		ud.sleepSwitch=2;
        response.sound = playsound(ud.voice, "yawn");
        response.yawn = "true";
		//llSay(ch, "yawn");
	}
	else if(ud.sleep<75 && ud.sleepSwitch!=1)
	{
		rlv("detach", "SKYN_sleep001")
		ud.sleepSwitch=1;
    }
	else if(ud.sleep>=100 && ud.sleepSwitch!=4)
	{
		if(response.osay.substring(0,1) == "@") response.osay += ",sit:00000000-0000-0000-0000-000000000000=force";
        else response.osay += "@sit:00000000-0000-0000-0000-000000000000=force";
		//ud.sleepMode=TRUE;
		ud.sleepSwitch=4;
    }
    
    //sweat
    if(body.features.substring(1,2)=="1") //sweat is off
    {
        if(ud.sweatSwitch!=1 && ud.energy<=((ud.fitness/4)*3) && ud.energy>(ud.fitness/2))
        {
            if(response.osay.substring(0,1) == "@") response.osay += ",detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat003=force,attachover:"+essr_folder+"~SKYN_Sweat001=force";
            else response.osay += "@detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat003=force,attachover:"+essr_folder+"~SKYN_Sweat001=force";
            ud.sweatSwitch=1;
        }
        else if(ud.sweatSwitch!=2 && ud.energy>(ud.fitness/4) && ud.energy<=(ud.fitness/2))
        {
            if(response.osay.substring(0,1) == "@") response.osay += ",detach:"+essr_folder+"~SKYN_Sweat001=force,detach:"+essr_folder+"~SKYN_Sweat003=force,attachover:"+essr_folder+"~SKYN_Sweat002=force";
            else response.osay += "@detach:"+essr_folder+"~SKYN_Sweat001=force,detach:"+essr_folder+"~SKYN_Sweat003=force,attachover:"+essr_folder+"~SKYN_Sweat002=force";
            ud.sweatSwitch=2;
        }
        else if(ud.sweatSwitch!=3 && ud.energy<=(ud.fitness/4))
        {
            if(response.osay.substring(0,1) == "@")  response.osay += ",detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat001=force,attachover:"+essr_folder+"~SKYN_Sweat003=force";
            else response.osay += "@detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat001=force,attachover:"+essr_folder+"~SKYN_Sweat003=force";
            ud.sweatSwitch=3;
        } 
        else if (ud.sweatSwitch!=0 && ud.energy>=ud.fitness) 
        {
            ud.sweatSwitch=0;
            if(response.osay.substring(0,1) == "@") response.osay += ",detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat001=force,detach:"+essr_folder+"~SKYN_Sweat003=force";
            else response.osay += "@detach:"+essr_folder+"~SKYN_Sweat002=force,detach:"+essr_folder+"~SKYN_Sweat001=force,detach:"+essr_folder+"~SKYN_Sweat003=force";
        }
    }
    
    
    if(ud.fatigueSwitch!=1 && ud.energy<=0)
    {
        if(response.osay.substring(0,1) == "@") response.osay += ",fly=n,temprun=n,alwaysrun=n";
        else response.osay += "@fly=n,temprun=n,alwaysrun=n";
        ud.fatigueSwitch=1;
    }
    else if(ud.fatigueSwitch!=2 && ud.energy>(ud.energy/8))
    {
        if(response.osay.substring(0,1) == "@") response.osay += ",fly=y,temprun=y,alwaysrun=y";
        else response.osay += "@fly=y,temprun=y,alwaysrun=y";
        ud.fatigueSwitch=2;
    }

    if(action.substring(0, 1)=="1") //sitting
    {
        ud.energy+=(ud.fitness/50); //resting

        if(parseInt(action.substring(5, 6))>=1) //ud.sleeping on ground =1 on object =2
        {
            ud.sleep--;
            ud.energy+=(ud.fitness/20); //resting even more
            response.sound = playsound(ud.voice, "snore")

            //particles
            if(!attached.includes("SKYN_SleepParticles"))
            {
                rlv("attachover", "SKYN_SleepParticles")

                if(action.substring(5,6)=="1") //ground sleeping
                {
                    response.anim = anims.sleeps[anims.sleeps.length * Math.random() | 0]
                }
                else //chair sleeping
                {
                    response.anim = anims.csleeps
                }
            }   
        }
        else //sitting but not ud.sleeping
        {
            ud.sleep+=0.05; //get ud.sleepy if not ud.sleeping while sitting
        }
    }
    else{ // not sitting
        ud.sleep+=0.1; //not sitting, get ud.sleepy! you could do 1/ud.energy to make it based off of ud.energy loss
    }

    //ud.coins
    if(ud.health>0)
    {
        if(body.features=="11111")
        {
            ud.timeAlive+=2;
            if(ud.hunger>0) ud.coins+=(ud.hunger/10000);
            if(ud.thirst>0) ud.coins+=(ud.thirst/10000);
            if(ud.fitness>=100) ud.coins+=(ud.fitness/100000);
            if(ud.energy<ud.fitness) ud.coins+=((ud.fitness-ud.energy)/1000000);
            if(ud.sleep<100) ud.coins+=((100-ud.sleep)/100000);
        }
    }
    else //dieing
    {
        ud.deathCount++;
        ud.timeAlive=0;
        ud.coins-=(ud.coins/10);
        ud.health=100;
        ud.hunger=100;
        ud.thirst=100;
        ud.sleep=0;
        if(response.osay.substring(0,1) == "@") response.osay += ",sit:00000000-0000-0000-0000-000000000000=force";
        else response.osay += "@sit:00000000-0000-0000-0000-000000000000=force";
        response.anim = anims.death
        response.death = "true"
        response.sound = playsound(ud.voice, "dieing"); 
    }
    if(ud.health<25 && body.features.substring(0,1)=="1")
    {
        response.sound = playsound(ud.voice, "low health");
    }

    //value min/max's//////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    if(ud.energy<0) ud.energy=0;
    if(ud.energy>ud.fitness) ud.energy=ud.fitness;
    if(ud.sleep>100) ud.sleep=100;
    if(ud.sleep<0) ud.sleep=0;
    if(ud.fitness<100) ud.fitness=100;
    if(ud.hunger>100) ud.hunger=100;
    if(ud.hunger<0) ud.hunger=0;
    if(ud.thirst>100) ud.thirst=100
    if(ud.thirst<0) ud.thirst=0;
    if(ud.pimples>100) ud.pimples=100;
    if(ud.pimples<0) ud.pimples=0;
    if(ud.fat>100) ud.fat=100;
    if(ud.fat<0) ud.fat=0;
    if(ud.health>100) ud.health=100;
    if(ud.health<0) ud.health=0;
    if(ud.coins<0) ud.coins=0;

    response.queue = queue
}
