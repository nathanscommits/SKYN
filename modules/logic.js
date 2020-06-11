
exports.values = function(ud, body, response) {
    let essr_folder = "~SKYN ESSR DLC/"
    let consumed = {} //= JSON.parse(body.consumed)
    consumed = body.consumed
    
    let action = body.action
    console.log(action)
    if(action.substring(0, 1)=="1") //sitting
    {
        ud.energy+=(ud.fitness/50); //resting

        if(parseInt(action.substring(5, 6))>=1) //ud.sleeping on ground =1 on object =2
        {
            ud.sleep--;
            ud.energy+=(ud.fitness/20); //resting even more

            if(action.substring(5,6)=="1") //ground sleeping
            {
                response.anim = "sleeping"
                response.sound = "snoring"
            }
            else //chair sleeping
            {
                response.anim = "sleeping_chair"
                response.sound = "snoring"
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
    
    if(action.substring(1, 2)=="1") //flying
    {
        ud.energy-=4;
    }
    if(action.substring(2, 3)=="1") //running
    {
        ud.energy-=2;
    }
    if(action.substring(3, 4)=="1") //walking/running
    {
        ud.energy--;
    }
    if(action.substring(4, 5)=="1") //jumping
    {
        ud.energy-=4;
    }
    if(ud.energy<=0){
        response.anim = "exhausted"
        response.sound = "breathing"
    }
    if(action.substring(0,5)=="00000") //standing
    {
        ud.energy+=(ud.fitness/100); //regain ud.energy while idle
        ud.fitness-=0.01; //passive ud.fitness loss

        console.log("standing")
    }
    if(ud.energy<ud.fitness)
    {
        ud.fitness+=100/ud.fitness; //ud.fitness gain when exercising, more ud.fitness means harder to earn ud.fitness
    }

    //if(action.substring(5, 5)==1) //underwater

    //if(action.substring(6, 6)==1) //in sun

    //consumables
    
    if(consumed.type != "food") 
    {
        ud.hunger-=0.1; //ud.hunger loss when not eating
        ud.fat-=0.1; //ud.fat loss when not eating
        ud.pimples-=0.1;
    }
    if(consumed.type != "drink")
    {
        ud.thirst-=0.1; //ud.thirst loss when not drinking
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
    }

    //ud.health
    if(ud.hunger<=0) ud.health-=0.5
    if(ud.thirst<=0) ud.health-=0.5
    else if(ud.hunger>0) ud.health+=0.1 //passive ud.health regain

    //value min/max's
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

    //ud.coins
    if(ud.health>0)
    {
        ud.timeAlive+2;
        if(ud.hunger>0) ud.coins+=(ud.hunger/1000);
        if(ud.thirst>0) ud.coins+=(ud.thirst/1000);
        if(ud.fitness>=100) ud.coins+=(ud.fitness/10000);
        if(ud.energy<ud.fitness) ud.coins+=((ud.fitness-ud.energy)/100000);
        if(ud.sleep<100) ud.coins+=((100-ud.sleep)/10000);
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
        response.anim = "death";
        response.sound = "dieing"; 
    }

    //if(ud.fitness>1000) ud.fitness=1000; //ud.fitness cap

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        if(response.osay.substring(0,1) == "@") response.osay += ",attach:"+essr_folder+"shape00" + ud.shape + "=force"
        else response.osay += "@attach:"+essr_folder+"shape00" + ud.shape + "=force"

    //pimples
    if(ud.pimples>=50 && ud.pimpleStage!=2)
    {
        if(response.osay.substring(0,1) == "@") response.osay += ",attachover:"+essr_folder+"~SKYN_Pimples001=force";
        else response.osay += "@attachover:"+essr_folder+"~SKYN_Pimples001=force";
        ud.pimpleStage=2;
    }
    else if(ud.pimples<50 && ud.pimpleStage!=1)
    {
        if(response.osay.substring(0,1) == "@") response.osay += ",detach:"+essr_folder+"~SKYN_Pimples001=force";
        else response.osay += "@detach:"+essr_folder+"~SKYN_Pimples001=force";
        ud.pimpleStage=1;
    }

    //sleep
    if(ud.sleep>=75 && ud.sleep<100 && ud.sleepSwitch!=2)
	{
		if(response.osay.substring(0,1) == "@") response.osay += ",attachover:"+essr_folder+"~SKYN_sleep001=force";
        else response.osay += "@attachover:"+essr_folder+"~SKYN_sleep001=force";
		ud.sleepSwitch=2;
		response.sound = "yawn";
		//llSay(ch, "yawn");
	}
	else if(ud.sleep<75 && ud.sleepSwitch!=1)
	{
		if(response.osay.substring(0,1) == "@") response.osay += ",detach:"+essr_folder+"~SKYN_sleep001=force";
        else response.osay += "@detach:"+essr_folder+"~SKYN_sleep001=force";
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
    //Death

}