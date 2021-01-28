const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false })
    console.log('Mongo DB Connected')
}

module.exports = connectDB;