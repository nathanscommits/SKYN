const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.set('views','views')
app.set('view engine', 'ejs')

//const router = require('./router')
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json())
let bodyData
app.post('/endpoint', (req, res) => {
    bodyData = req.body
})
app.get('/', function (req, res){
    res.send('home page!')
})
app.get('/endpoint', (req, res) => {
    res.send(bodyData)
})


//app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static('public'))



//app.use('/', router)

let port = process.env.PORT
if(port == null || port == '') {
  port = 3000
}

app.listen(port)