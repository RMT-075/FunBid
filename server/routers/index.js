const express = require('express');
const router = express.Router();
const admninRouter = require('./admin')
const publicRouter = require('./public')

router.get('/',(req,res) => {
    res.send ("alo")
})

router.use('/admin',admninRouter) 

router.use('/public',publicRouter)

module.exports = router