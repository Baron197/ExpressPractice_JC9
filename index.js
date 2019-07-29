var express = require('express')
var cors = require('cors')

var port = 1997

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

app.get('/', (req,res) => {
    res.send('<h1>Hello Guys</h1>')
})

app.get('/home', (req,res) => {
    res.send({ message: 'Ini Home' })
})

app.get('/products/:id', (req,res) => {
    console.log('Masuk /products/:id')
    // console.log(req.params.id)
    // console.log(typeof(req.params.id))
    var newArr = arr.filter((item) => item.id == req.params.id)
    // console.log(newArr)
    res.send(newArr)
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

app.listen(port, () => console.log(`API aktif di port ${port}`))