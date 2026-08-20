const router = require("express").Router();

const AdminController = require("../controllers/adminController");
const upload = require("../helpers/multer");
const authentication = require("../middlewares/authentication");
const authorizationAdmin = require("../middlewares/authorizationAdmin");

router.post('/login', AdminController.login)

router.use(authentication);
router.use(authorizationAdmin);

router.get("/dashboard", AdminController.getDashboard);
router.get("/auctions", AdminController.getAuctions);
router.post("/auctions", upload.single('image'), AdminController.createAuction);
router.post("/auctions/ai-suggestion", AdminController.getAiSuggestion);
router.get("/bids", AdminController.getBids);
router.get("/auctions/:id", AdminController.getAuctionById);
router.patch("/auctions/:id/status", AdminController.updateAuctionStatus);
router.put("/auctions/:id", upload.single('image'), AdminController.updateAuction);
router.delete("/auctions/:id", AdminController.deleteAuction);

module.exports = router;
