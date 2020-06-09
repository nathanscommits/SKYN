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

module.exports = router