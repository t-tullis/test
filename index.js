require('dotenv').config()

const port = process.env.PORT || 3000
const connectDB = require('./DB/dbConnection.js')
const server = require('./API/server.js')

connectDB();

server.listen(port, () => {
    console.log(`server listening to port:${port}`)
})


routes.get('/pets/:category', getPets);