var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mysql = require('mysql')

var port = 1997

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

var { MongoClient, ObjectID } = require('mongodb');
var url = `mongodb+srv://baron197:kecapabc123@clusterlatihan-xglmp.gcp.mongodb.net/test?retryWrites=true&w=majority`;

var arr = [{
    id:1,
    nama: 'Popok Hokage',
    harga: 100000,
    description: 'Siapkah bayi anda menjadi Hokage?'
}, {
    id:2,
    nama: 'Popok Ngesot',
    harga: 50000,
    description: 'Dijamin bayi anda ngesot abis!'
}, {
    id:3,
    nama: 'Popok Yang Tertukar',
    harga: 125000,
    description: 'Popok yang tiada bandingnya!'
}]

var app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req,res) => {
    res.send('<h1>Hello Guys</h1>')
})

app.get('/users', (req,res) => {
    if(!req.query.username) {
        req.query.username = ''
    }
    if(!req.query.password) {
        req.query.password = ''
    }
    var sql = `select u.*, r.nama as roleName 
                from users u
                left join roles r
                on u.roleId = r.id
                where username like '%${req.query.username}%'
                and password like '%${req.query.password}%'`;
    if(req.query.usiaMin) {
        sql += ` and usia >= ${req.query.usiaMin}`
    }
    if(req.query.usiaMax) {
        sql += ` and usia <= ${req.query.usiaMax}`
    }
    if(req.query.email) {
        sql += ` and email like '%${req.query.email}%'`
    }
    if(req.query.role) {
        sql += ` and r.nama = '${req.query.role}'`
    }

    db.query(sql, (err,results) => {
        if (err) res.status(500).send(err);
        
        console.log(results)
        res.status(200).send(results)
    })
})

app.get('/home', (req,res) => {
    res.send({ message: 'Ini Home' })
})

app.get('/products/:id', (req,res) => {
    console.log('Masuk /products/:id')
    // console.log(req.params.id)
    // console.log(typeof(req.params.id))
    // var newArr = arr.filter((item) => item.id == req.params.id)
    // console.log(newArr)
    res.send(arr.filter((item) => item.id == req.params.id)[0])
})

app.get('/products', (req,res) => {
    console.log('Masuk /products')
    // console.log(req.query)
    var newArr = arr
    if(req.query.nama) {
        newArr = newArr.filter(
            (item) => item.nama.toLowerCase().includes(req.query.nama.toLowerCase())
        )
    }
    if(req.query.hargaMin) {
        newArr = newArr.filter((item) => item.harga >= parseInt(req.query.hargaMin))
    }
    if(req.query.hargaMax) {
        newArr = newArr.filter((item) => item.harga <= parseInt(req.query.hargaMax))
    }

    res.send(newArr)
})

app.get('/test', (req,res) => {
    try {
        console.loog('Masuk Test')
        res.status(202).send('Request ke Test berhasil')
    } catch(err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
})

app.post('/addproduct', (req,res) => {
    console.log(req.body)
    arr.push(req.body)
    res.status(201).send({ message: 'Add Product Success!', newData: arr })
})

app.get('/category', (req,res) => {
    var sql = 'Select * from category;'
    db.query(sql, (err,results) => {
        if (err) res.status(500).send(err);
        
        console.log(results)
        res.status(200).send(results)
    })
})

app.post('/category', (req,res) => {
    var data = req.body;
    console.log(data)
    var sql = 'Insert into category set ?';
    db.query(sql,data,(err, results) => {
        if(err) {
            res.status(500).send(err)
        }
        
        sql = 'Select * from category;'
        db.query(sql, (err,results) => {
            if (err) res.status(500).send(err);
            
            console.log(results)
            res.status(200).send(results)
        })
    })
})

app.delete('/category/:id', (req,res) => {
    var sql = `Delete from category where id = ${req.params.id}`
    db.query(sql, (err,results) => {
        if(err) res.status(500).send(err)

        console.log(results)
        sql = 'Select * from category;'
        db.query(sql, (err,results) => {
            if (err) res.status(500).send(err);
            
            console.log(results)
            res.status(200).send(results)
        })
    })
})

app.put('/category/:id', (req,res) => {
    var sql = `Update category set ? where id = ${req.params.id}`;
    db.query(sql, req.body, (err,results) => {
        if(err) res.status(500).send(err)

        console.log(results)
        sql = 'Select * from category;'
        db.query(sql, (err,results) => {
            if (err) res.status(500).send(err);
            
            console.log(results)
            res.status(200).send(results)
        })
    })
})

app.get('/movies', (req,res) => {    
    if(!req.query.title) {
        req.query.title = ''
    }
    if(!req.query.limit) {
        req.query.limit = 20
    }
    var col = {}
    if(req.query.columns) {
        req.query.columns.forEach((item) => {
            col[item] = 1
        })
    }
    MongoClient.connect(url, (err,client) => {
        if (err) res.status(500).send(err)
        
        var moviesCol = client.db('sample_mflix').collection('movies');
        moviesCol.find({ title: { '$regex': req.query.title, '$options': 'i' } },col).limit(parseInt(req.query.limit)).toArray((err, docs) => {
            client.close();
            if (err) res.status(500).send(err)

            // console.log(docs);
            res.status(200).send(docs);
        })
    })
})






// app.get('/movies', (req,res) => {
//     if(!req.query.title) {
//         req.query.title = ''
//     }
//     var col = {}
//     if(req.query.columns) {
//         req.query.columns.forEach((item) => {
//             col[item] = 1
//         })
//     }
//     if(!req.query.limit) {
//         req.query.limit=0
//     }
    
//     MongoClient.connect(url, (err,client) => {
//         var moviesCol = client.db('sample_mflix').collection('movies');
//         moviesCol.find({ title: { '$regex': req.query.title, '$options': 'i' } }, col).limit(parseInt(req.query.limit)).toArray((err1, docs) => {
//             client.close();
//             if (err1) res.status(500).send(err1)

//             // console.log(docs);
//             res.status(200).send(docs);
//         })
//     })
// })

app.get('/moviestitles', (req,res) => {
    if(!req.query.title) {
        req.query.title = ''
    }
    MongoClient.connect(url, (err,client) => {
        var moviesCol = client.db('sample_mflix').collection('movies');
        moviesCol.find({ title: { '$regex': req.query.title, '$options': 'i' } }, { title: 1 }).limit(10).toArray((err1, docs) => {
            client.close();
            if (err1) res.status(500).send(err1)

            // console.log(docs);
            res.status(200).send(docs);
        })
    })
})

app.post('/movies', (req,res) => {
    console.log(req.body);
    MongoClient.connect(url, (err,client) => {
        var moviesCol = client.db('sample_mflix').collection('movies');
        moviesCol.insertMany(req.body.data, (err1, result) => {
            client.close();
            if (err1) res.status(500).send(err1)

            res.status(200).send(result);
        })
    })
})

app.delete('/movies/:id', (req,res) => {
    MongoClient.connect(url, (err,client) => {
        var moviesCol = client.db('sample_mflix').collection('movies');
        moviesCol.deleteOne({ _id: new ObjectID(req.params.id) }, (err, result) => {
            client.close();
            if(err) res.status(500).send(err)
            
            res.status(200).send(result);
        })
    })
})

app.put('/movies/:id', (req,res) => {
    if(!req.body.unset) {
        req.body.unset = { "kucing": 1 }
    }

    MongoClient.connect(url, (err,client) => {
        var moviesCol = client.db('sample_mflix').collection('movies');
        moviesCol.updateOne({ _id: new ObjectID(req.params.id) }, {$set: req.body.set, $unset: req.body.unset }, (err1, result) => {
            client.close();
            if(err) res.status(500).send(err)
            
            res.status(200).send(result);
        })
    })
})

app.listen(port, () => console.log(`API aktif di port ${port}`))

// var obj = {}
// obj.nama = 'baron'
// obj['nama'] = 'baron'
// var listcol = ['title','year']
// for(var i = 0; i < listcol.length; i++) {
//     obj[listcol[i]] = 1
// }
// listcol.forEach((item) => {
//     obj[item] = 1
// })