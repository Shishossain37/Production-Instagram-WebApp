const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const requireLogin = require('../middleware/requireLogin')

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        return res.status(402).json({ error: "Please fill all the fields" })
    } else {
        User.findOne({ email }).then((savedUser) => {
            if (savedUser) {
                return res.status(402).json({ error: "User is already exist" })
            } else {
                bcrypt.hash(password, 12).then((hashPass) => {
                    const user = new User({ name, email, password: hashPass, pic })
                    user.save().then(() => {
                        return res.status(200).json({ user, message: "Signup successfully" })
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
    }
})
router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(402).json({ error: "Please fill all the fields" })
    } else {
        User.findOne({ email }).then((savedUser) => {
            if (!savedUser) {
                return res.status(402).json({ error: "Invalid Email or Password" })
            } else {
                bcrypt.compare(password, savedUser.password).then((doMatch) => {
                    if (!doMatch) {
                        return res.status(402).json({ error: "Invalid Email or Password" })
                    } else {
                        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET_KEY,)
                        const { _id, name, email, followers, following, pic } = savedUser
                        return res.status(200).json({ token, user: { _id, name, email, followers, following, pic }, message: "Signin successfully" })
                    }
                }).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
    }
})

module.exports = router







