module.exports = function (body) {

    //move these lists to the database so dont need to restart server to edit them
    let blacklist = ["balaclava", "weed", "extinguisher"]
    let warmObjects = [
        "fire","heater","radiator","lava","flame","kiln","stove","boiler"
    ]   
    let wetObjects = [
        "water","pool","spa ","spring","tub ","bath","shower","pond","river","stream","lake","fountain"
    ]
    
    body.response.warm_objects_list = warmObjects.toString()
    body.response.wet_objects_list = wetObjects.toString()
    
    //if(body.info.warm_object != "none" && body.info.warm_object != ""){
        //body.response.announce = "Warm object discovered in range! name: "+body.info.warm_object+" range: "+body.info.warm_object_range
        //if(body.info.warm_object_range<5) 
    //}
    //if(body.info.wet_object != "none" && body.info.wet_object != ""){
        //body.response.announce = "Wet object discovered in range! name: "+body.info.wet_object+" range: "+body.info.wet_object_range
    //}

    return body
}