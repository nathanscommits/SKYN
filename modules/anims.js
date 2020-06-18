var express = require('../express')
let anims = express
anims.sleeps = [
    "Sleep_01_anim",
    "Sleep_02_anim",
    "Sleep_03_anim",
    "Sleep_04_anim",
]
anims.death = "death"
anims.csleeps = "Sleeping_Chair_loop"
anims.stretch = "Stretch"
anims.exhausted = "Exhausted_WIP"
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

module.exports = anims