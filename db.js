const mongodb = require('mongodb')

let connectionString = 'mongodb+srv://sharky:L293nShoTQPODgLi@cluster0-xivcd.gcp.mongodb.net/SKYN_HUD?retryWrites=true&w=majority'

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
    module.exports = client.db().collection('userdata')
    const app = require("./app")
    app.listen(3000)
})

let port = process.env.PORT
if(port == null || port == '') {
  port = 3000
}
