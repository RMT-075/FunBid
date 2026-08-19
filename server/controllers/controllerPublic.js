
const { compPW } = require('../helpers/bcrypt')
const {signToken, verifToken} = require('../helpers/jwt')
const {Product,User,Bid} = require('../models')

class PublicController{
    static async register(req,res,next){
        try {
            const {name,email,password,phoneNumber,address} = req.body
            // console.log(req.body);
            
            let data = await User.create({
                name,
                email,
                password,
            })
            res.status(201).json({
                message : "succeed to register",
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req,res,next){
        try {
            const {email,password} = req.body

            if (!email) {
                throw {name : "LoginEmail"}
            }

            if (!password) {
                throw {name : "LoginPassword"}
            }

            let cekEmail = await User.findOne({
                where : {
                    email
                }
            })

            if (!cekEmail) {
                throw {name : "LoginError"}
            }

            if (!compPW(password,cekEmail.password)) {
                throw {name : "LoginError"}
            }
            
            const payload = {
                id : cekEmail.id,
                name : cekEmail.name,
                email : cekEmail.email,
                role : cekEmail.role
            }

            const access_token = signToken(payload)

            res.status(200).json({
                access_token
            })

        
            
        } catch (error) {
            next(error)

            // res.send(error)
            // console.log(error);
            
            
            
        }
    }
}

module.exports = PublicController