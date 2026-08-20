const jwt = require('jsonwebtoken')

const signToken = (payload) =>{
    return jwt.sign(payload,"123123")
}

const verifToken = (token) =>{
    return jwt.verify(token,"123123")
}

module.exports = {signToken, verifToken}