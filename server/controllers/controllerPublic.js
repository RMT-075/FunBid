const { compPW } = require("../helpers/bcrypt");
const { signToken, verifToken } = require("../helpers/jwt");
const { Product, User, Bid, sequelize } = require("../models");
const { closeIfExpired, openIfStarted } = require("../jobs/closeAuctions");

const { GoogleGenAI } = require("@google/genai");

class PublicController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
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
        userId: cekEmail.id,
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

  static async getBidAdvice(req, res, next) {
    try {
      const ai = new GoogleGenAI({
        apiKey: "AQ.Ab8RN6IzkB-qX3OQT4v8SvpRxPTyY0cm2zGo18WbXridbCjZtQ",
      });
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) throw { name: "NotFound" };

      const currentPrice = Number(product.current_price);
      const bidIncrement = Number(product.bid_increment);
      const minimumBid = currentPrice + bidIncrement;

      const prompt = `
Kamu adalah asisten yang membantu penawar di aplikasi lelang online untuk memutuskan
apakah hari ini worth it untuk melanjutkan bid atau tidak.

Data produk:
- Nama: ${product.name}
- Deskripsi: ${product.description ? product.description : "(tidak ada deskripsi)"}
- Harga saat ini: ${currentPrice}
- Kenaikan bid: ${bidIncrement}
- Bid minimum berikutnya: ${minimumBid}

Analisa data di atas (terutama seberapa besar kenaikan bid dibanding harga saat ini, dan apakah deskripsi produk
mendukung untuk lanjut bid atau tidak), lalu PILIH SATU dari 3 opsi berikut yang paling sesuai:

- "merah"  = jangan bid lagi, karena tidak worth it
- "kuning" = tergantung kemauan/kebutuhan user, tidak ada jawaban pasti
- "hijau"  = worth it untuk bid lagi

Balas HANYA dalam format JSON murni (tanpa markdown, tanpa teks lain), persis struktur berikut:

{
  "decision": "merah" | "kuning" | "hijau",
  "reason": "satu kalimat alasan kenapa kamu memilih opsi itu, spesifik berdasarkan data di atas"
}

"reason" wajib 1 kalimat saja, dalam Bahasa Indonesia.
`.trim();

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      let options;
      try {
        options = JSON.parse(response.text);
      } catch (err) {
        throw { name: "AIParseError" };
      }

      res.status(200).json({
        message: "succeed to generate bid advice",
        data: {
          productId: product.id,
          currentPrice,
          bidIncrement,
          minimumBid,
          options,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = PublicController;
