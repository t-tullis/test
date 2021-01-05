const express = require('express');
const bcrypt = require('bcrypt');
const Users = require('../DB/User.js')

const server = express();

server.use(express.json());

server.post('/users', async (req, res) => {
    const createUser = req.body
    //creates bcrypt hashed password and sets user password to hash
    const hash = bcrypt.hashSync(createUser.password, 10)
    createUser.password = hash
    
    try{
        const createdUser = await Users.create(createUser)
        res.status(201).json(createdUser)
    }
    catch{
        res.status(400).json({message: 'There was an error creating your user.'})
    }
})

server.get('/users', async (req, res) => {
        const allUsers = await Users.find({})
        .lean()
        .exec()
        res.status(200).json(allUsers)
})

server.get('/', (req, res) => {
    res.send('ReadMe Testing API')
})

module.exports = server