const express = require('express');
const PublicController = require('../controllers/controllerPublic');
const authentication = require('../middlewares/authentication');
const router = express.Router();

router.get('/',(req,res) => {
    res.send ("public")
})

router.post('/login',PublicController.login)
router.post('/register',PublicController.register)

router.use(authentication)

router.get('/products',PublicController.read)
router.get('/products/:id',PublicController.readById)


module.exports = router