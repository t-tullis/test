const express = require('express');
const bcrypt = require('bcrypt');
const Users = require('../DB/User.js')
const readme = require('readmeio');


const server= express();

// Your ReadMe secret
const secret = '9bUtP45o3fqLpAifyX80';

server.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
  // Verify the request is legitimate and came from ReadMe.
  const signature = req.headers['readme-signature'];

  try {
    readme.verifyWebhook(req.body, signature, secret);
  } catch (e) {
    // Handle invalid requests
    return res.status(401).json({ error: e.message });
  }

  // Fetch the user from the database and return their data for use with OpenAPI variables.
  // const user = await db.find({ email: req.body.email })
  return res.json({
    // OAS Security variables
    api_key: 'api_key',
    petstore_auth: 'petstore_auth',
    'The Name here': 'The Name here',
    TestAuth: 'TestAuth',
    'X-Access-Client-Id': 'X-Access-Client-Id',
    'X-Access-Secret': 'X-Access-Secret',
    apiKey: 'apiKey',
  });
});


server.use(express.json());

// server.use(
//     readme.metrics('4Yaj9BBcmtorm5fXjMRtSOWTLOz7sewJ', req => ({
//       id: req.id,
//       label: req.label,
//       email: req.email,
//     }), {
//       development: true, // optional, sends logs to Development Data
//     })
//   );

server.get('/', (req, res) => {
    res.send('ReadMe Testing API')
})

//Creates A User
server.post('/users/create', async (req, res) => {
    const createUser = req.body
    //creates bcrypt hashed password and sets user password to hash
    const hash = bcrypt.hashSync(createUser.password, 10)
    createUser.password = hash 
    
    try{
        const createdUser = await Users.create(createUser)
        res.status(201).json({createdUser: createdUser})
    }
    catch{
        res.status(400).json({message: 'There was an error creating your user. Email and Password are required'})
    }
})

//Retrieves a user by email
server.get('/users/:email', async (req, res) => {
    const findEmail = req.params.email

    try{
        const findUserByEmail = await Users.findOne({
            "email": findEmail
        })
        .lean()
        .exec()
        
        if(findUserByEmail === null){
            res.status(404).json({error: "The user with this email doesn't exist"})
        }else{
        res.status(200).json(findUserByEmail)
        }
    }
    catch{
        res.status(404).json({message: "There was an error trying to find the user"})
    }
})

//deletes a user by email
server.delete('/users/delete/:email', async (req, res) => {
    const findEmail = req.params.email

    try{
        const findUserAndDelete = await Users.findOneAndDelete({
            "email": findEmail
        })
        .lean()
        .exec()
        if(findUserAndDelete === null){
            res.status(404).json({error: "The user with this email doesn't exist"})
        }else{
            res.status(200).json({userDeleted: findUserAndDelete})
        }
    }
    catch {
        res.status(404).json({message: "There was an error finding or deleting this"})
    }
})

//Update a user by email
server.put('/users/update/:email', async (req, res) => {
    const findEmail = req.params.email
    const updateUser = req.body

    try{
        const findUserAndUpdate = await Users.findOneAndUpdate({
            "email": findEmail
        }, 
        {
            $set: updateUser
        },
        {
            returnOriginal: false
        })
        .lean()
        .exec()

        if(findUserAndUpdate === null){
            res.status(404).json({error: "The user you're trying to update doesn't exist."})
        }else{
            res.status(200).json({updateUser: findUserAndUpdate})
        }
    }
    catch {
        res.status(404).json({message: "The user with that email does not exist"})
    }
})



//Retrieves all users
server.get('/users', async (req, res) => {
        const allUsers = await Users.find({})
        .lean()
        .exec()
        res.status(200).json(allUsers)
})


module.exports = server
