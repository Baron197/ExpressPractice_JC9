var { MongoClient, ObjectID, url } = require('../database').mongodb;

module.exports = {
    getMovies: (req,res) => {
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
    },
    addMovies: (req,res) => {
        console.log(req.body);
        MongoClient.connect(url, (err,client) => {
            var moviesCol = client.db('sample_mflix').collection('movies');
            moviesCol.insertMany(req.body.data, (err1, result) => {
                client.close();
                if (err1) res.status(500).send(err1)

                res.status(200).send(result);
            })
        })
    },
    deleteMovie: (req,res) => {
        MongoClient.connect(url, (err,client) => {
            var moviesCol = client.db('sample_mflix').collection('movies');
            moviesCol.deleteOne({ _id: new ObjectID(req.params.id) }, (err, result) => {
                client.close();
                if(err) res.status(500).send(err)
                
                res.status(200).send(result);
            })
        })
    },
    editMovie: (req,res) => {
        if(!req.body.unset) {
            req.body.unset = { "wibu": "" }
        }
        MongoClient.connect(url, (err,client) => {
                var moviesCol = client.db('sample_mflix').collection('movies');
                moviesCol.updateOne({ _id: new ObjectID(req.params.id) }, {$set: req.body.set, $unset: req.body.unset }, (err, result) => {
                    client.close();
                    if(err) res.status(500).send(err)
                    
                    res.status(200).send(result);
                })
            })
    }
}