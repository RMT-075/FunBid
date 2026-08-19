const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

const signToken = (payload) =>{
    return jwt.sign(payload,secretKey)
}

const verifToken = (token) =>{
    return jwt.verify(token,secretKey)
}

module.exports = {signToken, verifToken}