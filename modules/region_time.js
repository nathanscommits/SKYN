function float2int (value) {
    return value | 0;
}

module.exports = function(body) {
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
return body
///////////////////
}