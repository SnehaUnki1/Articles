const jwt = require('jsonwebtoken')
const User = require('../modules/user.module')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'abcd')
        const user = await User.findOne({ _id: decoded._id, accesstoken: token })

        if (!user) {
            throw new Error()

        }
        req.accesstoken = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth