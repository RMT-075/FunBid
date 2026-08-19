const router = require('express').Router()

const AdminController = require('../controllers/adminController')
const authentication = require('../middlewares/authentication')
const authorizationAdmin = require('../middlewares/authorizationAdmin')

router.use(authentication)
router.use(authorizationAdmin)

router.get('/auctions', AdminController.getAuctions)
router.post('/auctions', AdminController.createAuction)
router.get('/auctions/:id', AdminController.getAuctionById)
router.put('/auctions/:id', AdminController.updateAuction)
router.delete('/auctions/:id', AdminController.deleteAuction)

module.exports = router