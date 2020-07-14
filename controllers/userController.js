const db = require('../db')

exports.leaderboard = function (req, res) {
    let topten = ''
    db.find().sort({totalCoins: -1}).collation({locale: "en_US", numericOrdering: true}).toArray(function (err, result) {
        if(err) throw err;
        let leaderboard = Object.assign({}, result)
        let rank = 0;
        for (let i in leaderboard)
        {  
            if(rank>9) break; 
            if(leaderboard[i].name != 'Pixel Tyran' && leaderboard[i].name != 'Sharky Piggins' && leadeboard[i].version.substring(0,1) == "1")
            {
                rank ++;
                topten = topten.concat('<tr><th>Rank ', rank,'</th><th>', leaderboard[i].name, '</th><th>', parseInt(leaderboard[i].totalCoins), '</th></tr>');  
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