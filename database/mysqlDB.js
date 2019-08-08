var mysql = require('mysql')
var db = mysql.createConnection({
    host: 'db4free.net',
    user: 'saitama',
    password: 'kecapabc123',
    database: 'popokkeces',
    port: 3306
})

// var db = mysql.createConnection({
//     host: 'localhost',
//     user: 'saitama',
//     password: 'abc123',
//     database: 'popokkece',
//     port: 3306
// })

module.exports = db