const express = require('express');
const PublicController = require('../controllers/controllerPublic');
const router = express.Router();

router.get('/',(req,res) => {
    res.send ("public")
})

router.post('/login',PublicController.login)
router.post('/register',PublicController.register)


module.exports = router