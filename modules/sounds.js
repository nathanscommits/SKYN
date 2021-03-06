//d1e83b54-cc26-d069-f950-a04e4f94fe1f silence
module.exports = {
    play: function (voice, sound)
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
                "777ef6cc-ee80-6919-c977-790b477e0fc6","7faa816c-e66d-7439-85be-82635847d416","87549ea0-e1eb-1512-af13-1441ecc6eb23"]
                //queue = 1
            }
            else if(sound=="drowningDeath") sounds=["960223a8-ee61-39ef-c37c-0ce2109eae06",
                "8d0a6593-d88e-41c3-53f6-854657949e71"]
        }
        else if(voice==2) { //fem voice sounds
            if(sound == "breathing") {
                sounds = [
                "e995d655-673a-48db-3f37-2a45844e7558",
                "9f76903f-64e6-a2e3-76c8-9970f665461f",
                "f441f752-ea65-0f80-0721-1d698f12c062",
                "6daf7ca9-70b9-4254-3991-459c0d2c553b"]
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
                sounds=["28cb37ba-9174-f237-8f2b-f65077e31611",
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
                sounds=["e5a80866-cea8-1ed4-72bc-5ba8ea6c760c","7faa816c-e66d-7439-85be-82635847d416","87549ea0-e1eb-1512-af13-1441ecc6eb23"]
                //queue = 1
            }
            else if(sound=="drowningDeath") sounds=["e4b0933c-99c6-4ef8-7d6f-367973c13277"]
        }

        //if(sound=="drowning") sounds=["7faa816c-e66d-7439-85be-82635847d416","87549ea0-e1eb-1512-af13-1441ecc6eb23"]
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
        if(sound=="coins") sounds=["991deed9-2d9e-4cdf-e445-3a25af22a426"]
        if(sound=="dieing") sounds=["7a17a826-de7a-241a-f840-05c32ac26399"]
        if(sound=="low health") {
            sounds=["10ea379e-38ed-86f6-9f58-27cf6315b5c6"]
            //queue = 1
        }

        
    return sounds[sounds.length * Math.random() | 0]
    }
}
