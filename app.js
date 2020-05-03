const express = require('express')
const bodyParser = require('body-parser')
const app = express()

//const router = require('./router')

app.use(bodyParser.urlencoded({extended: true}))
  
app.use(bodyParser.json())
  
app.post('/endpoint', (req, res) => {
    console.log(req.body.todo)
})

app.get('/endpoint', (req, res) => {
    res.send('reply from the server')
})

//app.use(express.urlencoded({extended: false}))
//app.use(express.json())

//app.use(express.static('public'))
//app.set('views','views')
//app.set('view engine', 'ejs')

//app.use('/', router)

//app.listen(3000)