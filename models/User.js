const validator = require("validator")

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.validate = function() {
    if (this.data.username=="") {this.errors.push("UUID error")}
    if (this.data.password!="berrybutts6969") {this.errors.push("Password error")}
}

User.prototype.register = function() {
    // step 1 validate data
    this.validate()
    // step 2 only if no errors then save into database
}

module.exports = User