const { Product } = require('../models')

class AdminController {
    static async getAuctions(req, res, next) {
        try {
            const products = await Product.findAll({
                order: [['createdAt', 'DESC']]
            })

            res.status(200).json(products)
        } catch (error) {
            next(error)
        }
    }

    static async createAuction(req, res, next) {
        try {
            const {
                name,
                description,
                image_url,
                starting_price,
                bid_increment,
                start_time,
                end_time,
                status
            } = req.body

            const { userId } = req.loginInfo

            const product = await Product.create({
                name,
                description,
                image_url,
                starting_price,
                bid_increment,
                start_time,
                end_time,
                status,
                created_by: userId
            })

            res.status(201).json(product)
        } catch (error) {
            next(error)
        }
    }

    static async getAuctionById(req, res, next) {
        try {
            const { id } = req.params

            const product = await Product.findByPk(id)

            if (!product) {
                throw { name: 'NotFound' }
            }

            res.status(200).json(product)
        } catch (error) {
            next(error)
        }
    }

    static async updateAuction(req, res, next) {
        try {
            const { id } = req.params

            const product = await Product.findByPk(id)

            if (!product) {
                throw { name: 'NotFound' }
            }

            const {
                name,
                description,
                image_url,
                starting_price,
                bid_increment,
                start_time,
                end_time,
                status
            } = req.body

            await product.update({
                name,
                description,
                image_url,
                starting_price,
                bid_increment,
                start_time,
                end_time,
                status
            })

            res.status(200).json({
                message: 'Auction updated successfully',
                product
            })
        } catch (error) {
            next(error)
        }
    }

    static async deleteAuction(req, res, next) {
        try {
            const { id } = req.params

            const product = await Product.findByPk(id)

            if (!product) {
                throw { name: 'NotFound' }
            }

            await product.destroy()

            res.status(200).json({
                message: 'Auction deleted successfully'
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = AdminController