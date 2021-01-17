const express = require('express')
const User = require('../models/userModel');
const router = new express.Router()

const authentication = require('../middleware/authentication')


router.get('/me', authentication, (req, res) => {
    // we have access to the full user on req.user because the user instance is created during the auth check by the middleware
    res.send(req.user);
})
  
router.post("/users/signup", async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        await user.save();
        const token = await user.generateAuthToken()
        res.status(201).send({user, token});
    } catch (e) {
        res.status(500).send(e.message);
    }
});
  
router.post('/users/login',  async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()    
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e.message);
    }

})

router.post('/users/logout', authentication, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        console.log(req.user.tokens)
        await req.user.save();
        res.send('Logged out successfully')
    }catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete('/users/me', authentication, async (req, res) => {
    try {
        await req.user.remove().catch((e)=> {console.log(e)});
        res.send(req.user);
    } catch(e) {
        res.status(500).send(e.message)
    }
})

module.exports = router