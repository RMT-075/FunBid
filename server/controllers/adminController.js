const { compPW } = require("../helpers/bcrypt");
const client = require("../helpers/imageKit");
const ImageKit = require("@imagekit/nodejs");
const { signToken } = require("../helpers/jwt");
const { User, Product, Bid } = require("../models");
const ai = require("../helpers/gemini");

class AdminController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw {
          name: "LoginEmail",
        };
      }

      if (!password) {
        throw {
          name: "LoginPassword",
        };
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw {
          name: "LoginError",
        };
      }

      const isValidPassword = compPW(password, user.password);

      if (!isValidPassword) {
        throw {
          name: "LoginError",
        };
      }

      if (user.role !== "admin") {
        throw {
          name: "Forbidden",
        };
      }

      const access_token = signToken({
        userId: user.id,
      });

      res.status(200).json({
        access_token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(req, res, next) {
    try {
      const totalAuction = await Product.count();
      const upcoming = await Product.count({
        where: {
          status: "upcoming",
        },
      });

      const live = await Product.count({
        where: {
          status: "live",
        },
      });

      const ended = await Product.count({
        where: {
          status: "ended",
        },
      });

      res.status(200).json({
        totalAuction,
        upcoming,
        live,
        ended,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAuctions(req, res, next) {
    try {
      const products = await Product.findAll({
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getBids(req, res, next) {
    try {
      const bids = await Bid.findAll({
        include: [
          {
            model: Product,
            attributes: ["id", "name"],
          },
          {
            model: User,
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(bids);
    } catch (error) {
      next(error);
    }
  }

  static async createAuction(req, res, next) {
    try {
      const {
        name,
        description,
        starting_price,
        bid_increment,
        start_time,
        end_time,
        status,
      } = req.body;

      const { userId } = req.loginInfo;

      if (Number(starting_price) <= 0) {
        throw {
          name: "ValidationError",
          message: "Starting price must be greater than 0",
        };
      }

      if (Number(bid_increment) <= 0) {
        throw {
          name: "ValidationError",
          message: "Bid increment must be greater than 0",
        };
      }

      if (new Date(end_time) <= new Date(start_time)) {
        throw {
          name: "ValidationError",
          message: "End time must be after start time",
        };
      }

      let image_url = null;

      if (req.file) {
        const result = await client.files.upload({
          file: await ImageKit.toFile(
            Buffer.from(req.file.buffer),
            req.file.originalname,
          ),
          fileName: req.file.originalname,
        });

        image_url = result.url;
      }

      const product = await Product.create({
        name,
        description,
        image_url,
        starting_price,
        bid_increment,
        start_time,
        end_time,
        status,
        created_by: userId,
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async getAiSuggestion(req, res, next) {
    try {
      const { name, description } = req.body;

      if (!name) {
        throw {
          name: "ValidationError",
          message: "Product name is required",
        };
      }

      const prompt = `
        You are an expert auction assistant.

        Analyze this auction product:

        Product name: ${name}
        Current description: ${description || "No description provided"}

        Give suggestions for:
        1. An improved and attractive product description.
        2. A reasonable suggested starting price in Indonesian Rupiah.
        3. A reasonable suggested bid increment in Indonesian Rupiah.

        Return ONLY valid JSON with this exact format:

        {
          "suggestedDescription": "string",
          "suggestedStartingPrice": number,
          "suggestedBidIncrement": number
        }
        `;

      let response;

      // retry maksimal 3 kali
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          break;
        } catch (error) {
          console.log(`AI attempt ${attempt} failed`);

          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
          } else {
            throw error;
          }
        }
      }

      const result = JSON.parse(response.text);

      res.status(200).json({
        description: result.suggestedDescription,
        starting_price: result.suggestedStartingPrice,
        bid_increment: result.suggestedBidIncrement,
      });

    } catch (error) {
      next(error);
    }
  }

  static async getAuctionById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "NotFound" };
      }

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async updateAuction(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "NotFound" };
      }

      const {
        name,
        description,
        starting_price,
        bid_increment,
        start_time,
        end_time,
        status,
      } = req.body;

      if (starting_price !== undefined && Number(starting_price) <= 0) {
        throw {
          name: "ValidationError",
          message: "Starting price must be greater than 0",
        };
      }

      if (bid_increment !== undefined && Number(bid_increment) <= 0) {
        throw {
          name: "ValidationError",
          message: "Bid increment must be greater than 0",
        };
      }

      const newStartTime = start_time || product.start_time;
      const newEndTime = end_time || product.end_time;

      if (new Date(newEndTime) <= new Date(newStartTime)) {
        throw {
          name: "ValidationError",
          message: "End time must be after start time",
        };
      }

      let image_url = product.image_url;

      if (req.file) {
        const result = await client.files.upload({
          file: await ImageKit.toFile(
            Buffer.from(req.file.buffer),
            req.file.originalname,
          ),
          fileName: req.file.originalname,
        });

        image_url = result.url;
      }

      await product.update({
        name,
        description,
        image_url,
        starting_price,
        bid_increment,
        start_time,
        end_time,
        status,
      });

      res.status(200).json({
        message: "Auction updated successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateAuctionStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatus = ["upcoming", "live", "ended"];

      if (!validStatus.includes(status)) {
        throw {
          name: "ValidationError",
          message: "Invalid auction status",
        };
      }

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "NotFound" };
      }

      await product.update({
        status,
      });

      res.status(200).json({
        message: "Auction status updated successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAuction(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "NotFound" };
      }

      await product.destroy();

      res.status(200).json({
        message: "Auction deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
