require('dotenv').config()

const port = process.env.PORT || 8000
const connectDB = require('./DB/dbConnection.js')
const server = require('./API/server.js')

connectDB();

server.listen(8000, '0.0.0.0', () => {
    console.log(`Example app listening at port: ${port}`);
  });
