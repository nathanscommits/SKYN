const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')

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
    //this.res.render('leaderboard', userController)
    userController.leaderboard(req, res)
})

router.post("/3489h40", (req, res) => {
    postController.hudUpdate(req, res)
})

router.post("/29uf9374hs", (req, res) => {
    postController.userInfo(req, res)
})

let pool = 100
router.post('/834h98h3', (req,res) => {
    let response = {}
    //get avatar and ammount they paid
    let UUID = req.UUID
    let price = req.price
    //get random prize key
    let key = pool * Math.random() | 0
    
    response.key = key
    //see if avatar wants it
    res.send(response)
})

router.post('/329yfh3', (req,res) => {
    //give item or refund
})

module.exports = router