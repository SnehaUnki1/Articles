const express = require('express')
require('./db/mongoose')
const User = require('./modules/user.module')
const Article = require('./modules/article.module')
const auth = require('./middleware/auth')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/register', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateToken()
        await user.save()
        res.status(201).send({
            response: {
                statusCode: "201",
                body: {
                    message: "new user created"

                }
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

app.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        //const token = await user.generateToken()
        res.status(200).send({
            response: {
                statusCode: "200",
                body: {
                    message: "success",
                    accessToken: user.accesstoken
                }
            }
        })
    } catch (e) {
        res.status(400).send({
            response: {
                error: e
            }
        })
    }
})

app.post('/articles', auth, async (req, res) => {

    const article = new Article({
        ...req.body,
        author: req.user.username,
        accesstoken: req.user.accesstoken
    })

    try {
        await article.save()
        res.status(201).send({
            response: {
                statusCode: "201",
                body: {
                    message: "new article created",
                }
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }

})

app.get('/articles', auth, async (req, res) => {
    try {

        const articles = await Article.find({}, { _id: 0, title: 1, body: 1, author: 1 })

        if (!articles) {
            return res.status(404).send()
        }

        res.send({ body: { articles } })
    } catch (e) {
        res.status(500).send()
    }
})

app.listen(port, () => {
    console.log("Server is up on port : ", port)
})

