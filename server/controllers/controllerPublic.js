const { compPW } = require("../helpers/bcrypt");
const { signToken, verifToken } = require("../helpers/jwt");
const { Product, User, Bid, sequelize } = require("../models");
const { closeIfExpired, openIfStarted } = require("../jobs/closeAuctions");

class PublicController {
  static async register(req, res, next) {
    try {
      const { name, email, password} = req.body;
      // console.log(req.body);

      let data = await User.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        message: "succeed to register",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "LoginEmail" };
      }

      if (!password) {
        throw { name: "LoginPassword" };
      }

      let cekEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (!cekEmail) {
        throw { name: "LoginError" };
      }

      if (!compPW(password, cekEmail.password)) {
        throw { name: "LoginError" };
      }

      const payload = {
        id: cekEmail.id,
        name: cekEmail.name,
        email: cekEmail.email,
        role: cekEmail.role,
      };

      const access_token = signToken(payload);

      res.status(200).json({
        access_token,
      });
    } catch (error) {
      next(error);

      // res.send(error)
      // console.log(error);
    }
  }

  static async read(req, res, next) {
    try {
      const data = await Product.findAll({
        include: [
          {
            model: User,
            as: "winner",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      res.status(200).json({
        message: "succeed read data",
        data,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async readById(req, res, next) {
    try {
      const { id } = req.params;

      let data = await Product.findByPk(id, {
        include: [
          {
            model: User,
            as: "winner",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      if (!data) {
        throw { name: "NotFound" };
      }

      await openIfStarted(data, req.app.get("io"));
      await closeIfExpired(data, req.app.get("io"));

      res.status(200).json({
        message: "succeed read data",
        data,
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async getBidsByProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) throw { name: "NotFound" };

      const bids = await Bid.findAll({
        where: { product_id: id },
        include: [{ model: User, attributes: ["id", "name", "email"] }],
        order: [["amount", "DESC"]],
      });

      res.status(200).json({
        message: "succeed read data",
        data: bids,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createBid(req, res, next) {

    const t = await sequelize.transaction();

    try {
      const { id } = req.params; // product id
      const { amount } = req.body;
      const userId = req.loginInfo.userId;

      if (!amount || isNaN(amount)) {
        throw { name: "BidInvalidAmount" };
      }

      // row lock: SELECT ... FOR UPDATE
      const product = await Product.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!product) throw { name: "NotFound" };

      const now = new Date();
      if (product.status !== "live") {
        throw { name: "AuctionNotLive" };
      }
      if (now < product.start_time || now > product.end_time) {
        throw { name: "AuctionNotInRange" };
      }

      const minimumBid =
        Number(product.current_price) + Number(product.bid_increment);

      if (Number(amount) < minimumBid) {
        throw { name: "BidTooLow", minimumBid };
      }

      const bid = await Bid.create(
        {
          product_id: product.id,
          user_id: userId,
          amount,
        },
        { transaction: t },
      );

      product.current_price = amount;
      product.winner_id = userId;
      await product.save({ transaction: t });

  
      await t.commit();

      const bidWithUser = await Bid.findByPk(bid.id, {
        include: [{ model: User, attributes: ["id", "name", "email"] }],
      });

      const io = req.app.get("io");
      io.to(`product:${product.id}`).emit("newBid", {
        productId: product.id,
        currentPrice: product.current_price,
        winnerId: product.winner_id,
        bid: bidWithUser,
      });

      res.status(201).json({
        message: "succeed to bid",
        data: bidWithUser,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = PublicController;