const { compPW } = require("../helpers/bcrypt");
const { signToken, verifToken } = require("../helpers/jwt");
const { Product, User, Bid } = require("../models");

class PublicController {
  static async register(req, res, next) {
    try {
      const { name, email, password, phoneNumber, address } = req.body;
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

      let data = await Product.findByPk(id,{
        include: [
          {
            model: User,
            as: "winner",
            attributes: { exclude: ["password"] },
          },
        ]
      });

      if (!data) {
        throw { name: "NotFound" };
      }

      res.status(200).json({
        message: "succeed read data",
        data,
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
}

module.exports = PublicController;
