const express = require('express');
const bcrypt = require('bcrypt');
const Users = require('../DB/User.js')

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('ReadMe Testing API')
})

server.post('/users/create', async (req, res) => {
    const createUser = req.body
    //creates bcrypt hashed password and sets user password to hash
    const hash = bcrypt.hashSync(createUser.password, 10)
    createUser.password = hash
    
    try{
        const createdUser = await Users.create(createUser)
        res.status(201).json(createdUser)
    }
    catch{
        res.status(400).json({message: 'There was an error creating your user. Email and Password are required'})
    }
})

server.get('/users/:email', async (req, res) => {
    const findEmail = req.params.email

    try{
        const findUserByEmail = await Users.findOne({
            "email": findEmail
        })
        .lean()
        .exec()
        res.status(200).json(findUserByEmail)
    }
    catch{
        res.status(404).json({message: "The user with this email does not exist"})
    }
})
/* @oas [get] /users
 * description: "Gets all users"
 * base: "/"
 * responses:
 *   "200":
 *     description: "A list of users."
 *     schema:
 *       type: "String"
 */

server.get('/users', async (req, res) => {
        const allUsers = await Users.find({})
        .lean()
        .exec()
        res.status(200).json(allUsers)
})


module.exports = server

