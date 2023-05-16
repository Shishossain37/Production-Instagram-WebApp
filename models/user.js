const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/da9kvhg3e/image/upload/v1682397464/jth87nwgswlpm6vmnnuo.jpg"
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
}, {
    timesTamp: true
})
module.exports = mongoose.model("User", userSchema)


