const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const postController2 = require('./controllers/postController2')

const db = require('./db')

router.get('/', function (req, res){
    res.render('home-guest')
})
router.get('/prizes', function (req, res){
    res.render('prizes')
})
router.get('/tutorial', function (req, res){
    res.render('tutorial')
})
router.get('/HUD_guide', function (req, res){
    res.render('HUD_guide')
})
router.get('/leaderboard', function(req, res){
    userController.leaderboard(req, res)
})

/*router.post("/3489h40", (req, res) => {
    postController.hudUpdate(req, res)
})*/

router.post("/hudUpdate010uhe8", (req, res) => {
    postController.hudUpdate(req, res)      //HUD update
})

router.post("/29uf9374hs", (req, res) => {
    postController.userInfo(req, res)       //User info
})


router.post('/834h98h3', (req,res) => {
    postController.prizeGen(req, res)      //Generate prize
})

router.post('/329yfh3', (req,res) => {
    postController.venderGiver(req, res)   //give item
})

router.post('/38ufg423', (req,res) => {
    postController.refund(req, res)        //refund item
})

router.post('/7fh839d', (req,res) => {
    postController.savePrize(req, res)    //save user prize list
})


module.exports = router