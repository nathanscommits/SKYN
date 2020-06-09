function decrypt(x,y,z)
{
    let a = x.indexOf(y) + y.length()
    let b = x.indexOf(z) - 1
    if(z==-1) b = -1
    if(y==0) a=0
    return x.substring(a,b)
}

exports.values = function(userdata, body) {
    let sleep = userdata.sleep
    let energy = userdata.energy
    let fitness = userdata.fitness

    let consumed = body.consumed
    consumed.type = decypt(consumed, "type:", "ammount:")
    consumed.ammount = decrypt(consumed, "ammount:", "effect:")
    consumed.effect = decrypt(consumed, "effect:", "fat:")
    consumed.fat = decrypt(consumed, "fat:", -1)

    let action = body.action
    if(action.substring(0, 0)==1) //sitting
    {
        energy+=(fitness/50); //resting

        if(action.substring(5, 5)>=1) //sleeping on ground =1 on object =2
        {
            sleep--;
            energy+=(fitness/20); //resting even more
        }
        else //sitting but not sleeping
        {
            sleep+=0.05; //get sleepy if not sleeping while sitting
        }
    }
    else{ // not sitting
        sleep+=0.1; //not sitting, get sleepy! you could do 1/energy to make it based off of energy loss
    }
    
    if(action.substring(1, 1)==1) //flying
    {
        energy-=4;
    }
    if(action.substring(2, 2)==1) //running
    {
        energy-=2;
    }
    if(action.substring(3, 3)==1) //walking/running
    {
        energy--;
    }
    if(action.substring(4, 4)==1) //jumping
    {
        energy-=4;
    }
    if(action.substring(0,4)=="00000") //standing
    {
        energy+=(fitness/100); //regain energy while idle
        fitness-=0.01; //passive fitness loss
    }
    if(energy<fitness)
    {
        fitness+=100/fitness; //fitness gain when exercising, more fitness means harder to earn fitness
    }

    //if(action.substring(5, 5)==1) //underwater

    //if(action.substring(6, 6)==1) //in sun

    if(consumed.type == "food") //eating something
    {
        hunger+=consumed.ammount
        weight += consumed.fat
    }
    else 
    {
        hunger-=0.1; //hunger loss when not eating
    }

    if(consumed.type == "drink")
    {
        thirst+=consumed.ammount
    }
    else
    {
        thirst-=0.1;
    }



    if(sleep<0) sleep=0;
    if(energy<0) energy=0;
    if(fitness<0) fitness=0;
    //if(fitness>1000) fitness=1000; //fitness cap
}