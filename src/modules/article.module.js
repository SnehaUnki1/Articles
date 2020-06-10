const mongoose = require('mongoose')


const articleSchema = new mongoose.Schema([{

    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        ref: 'User',
        trim: true,
    },
    accesstoken: [{
        type: String,
        required: true
    }]

}])

const Article = mongoose.model('Article', articleSchema)

module.exports = Article