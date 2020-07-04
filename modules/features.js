module.exports = function(body) {
    //if(body.info.features.substring(0,1)!="1") return; //all features on  
    if(body.info.features.substring(2,3)=="0") { //food is off
        if(body.values.hunger<=0)body.values.hunger++
        if(body.values.thirst<=0)body.values.thirst++
    }
    if(body.info.features.substring(3,4)=="0") {
         if(body.values.sleep>=99)body.values.sleep-=2 //sleep is off
    }
    if(body.info.features.substring(4,5)=="0") body.values.energy+=100 //energy is off

    return body
}