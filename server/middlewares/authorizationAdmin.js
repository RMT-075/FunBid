const authorizationAdmin = async (req, res, next) => {
    try {
        const { userId } = req.loginInfo

        const user = await User.findByPk(userId)

        if (!user) {
            throw { name: "NotFound" }
        }

        if (user.role !== "admin") {
            throw { name: "Forbidden" }
        }

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authorizationAdmin