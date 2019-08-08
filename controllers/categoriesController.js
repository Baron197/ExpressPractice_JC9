var { db } = require('../database').mysql;

module.exports = {
    getCategories: (req,res) => {
        var sql = 'Select * from category;'
        db.query(sql, (err,results) => {
            if (err) res.status(500).send(err);
            
            console.log(results)
            res.status(200).send(results)
        })
    },
    addCategories: (req,res) => {
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
    },
    editCategory: (req,res) => {
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
    },
    deleteCategory: (req,res) => {
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
    }
}