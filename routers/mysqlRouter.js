var express = require('express')
var router = express.Router()
const { categoriesController } = require('../controllers')

router.get('/category', categoriesController.getCategories)
router.post('/category', categoriesController.addCategories)
router.put('/category/:id', categoriesController.editCategory)
router.delete('/category/:id', categoriesController.deleteCategory)

module.exports = router;