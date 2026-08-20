const express = require('express');
const router = express.Router();
const admninRouter = require('./admin')
const publicRouter = require('./public');
const errorHandler = require('../middlewares/errorHandler');

router.get('/',(req,res) => {
    res.send ("alo")
})

router.use('/admin',admninRouter) 

router.use('/public',publicRouter)

router.use(errorHandler)


module.exports = router