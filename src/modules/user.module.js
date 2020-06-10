const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema([{

    username: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Passowrd should not contain password string')
            }
        }

    },
    accesstoken: [{
        type: String,
        required: true
    }]

}])


userSchema.methods.generateToken = async function () {
    const user = this
    token = await jwt.sign({ _id: user._id.toString() }, 'abcd')

    user.accesstoken = token
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (username, password) => {

    const user = await User.findOne({ username })
    console.log(user, username, password)

    if (user === "") {
        console.log('error')
        throw new Error('Unable to login')

    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        console.log('Password mismatch')
        throw new Error('Unable to login')
    }

    return user
}


// // Creating hash security for the password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.virtual('article', {
    ref: 'Article',
    localField: 'username',
    foreignField: 'author'
})

const User = mongoose.model('User', userSchema)

module.exports = User