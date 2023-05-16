const express = require("express")
const dotenv = require('dotenv').config()
const bodyparser = require('body-parser')
const app = express()
const mongoose = require("mongoose")
const PORT = process.env.PORT || 8080
const path = require('path')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on("connected", () => {
    console.log("Successfully connected to Database");
})
mongoose.connection.on("error", () => {
    console.log("Error while connecting to Database");
})



require('./models/user')
require('./models/post')
app.use(bodyparser.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))



//Static files
app.use(express.static(path.join(__dirname, './client/build')))
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))

})


app.listen(PORT, () => {
    console.log("App is running on ", PORT);
})

