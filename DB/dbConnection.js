const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true  })
    console.log('Mongo DB Connected')
}

module.exports = connectDB;