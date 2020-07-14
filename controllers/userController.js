const db = require('../db');
const { Template } = require('ejs');

exports.leaderboard = function (req, res) {
    let topten = ''
    db.find().sort({totalCoins: -1}).collation({locale: "en_US", numericOrdering: true}).toArray(function (err, result) {
        if(err) throw err;
        let leaderboard = Object.assign({}, result)
        let rank = 0;
        for (let i in leaderboard)
        {  
            if(rank>9) break; 
            let user_version = leaderboard[i].version
            let total_balance = parseInt(leaderboard[i].totalCoins)
            if(typeof user_version !== "undefined") user_version = user_version.substring(0,1)
            console.log(
                leaderboard[i].name+ " "+
                user_version+ " "+
                total_balance + " " + rank
                )
            if(leaderboard[i].name != 'Pixel Tyran' && leaderboard[i].name != 'Sharky Piggins' && user_version == "1" && total_balance > 0)
            {
                rank ++;
                topten = topten.concat('<tr><th>Rank ', rank,'</th><th>', leaderboard[i].name, '</th><th>', total_balance, '</th></tr>');  
            }
        }
        res.render('leaderboard', {totalCoins: topten})
    }) 
}

exports.slapboard = function (req,res) {
    let topten = ''
    db.find().sort({slappoints: -1}).collation({locale: "en_US", numericOrdering: true}).toArray(function (err, result) {
        if(err) throw err;
        let leaderboard = Object.assign({}, result)
        let rank = 0;
        for (let i in leaderboard)
        {  
            if(rank>9) break; 
            if(leaderboard[i].name != 'Pixel Tyran' && leaderboard[i].name != 'Sharky Piggins')
            {
                rank ++;
                topten = topten.concat('<tr><th>Rank ', rank,'</th><th>', leaderboard[i].name, '</th><th>', parseInt(leaderboard[i].slappoints), '</th></tr>');  
            }
        }
        res.render('slapboard', {slappoints: topten})
    })
}