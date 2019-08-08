const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');
const router = express.Router();


router.get('/', (req, res) => {
    Users.get()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({ error: "COuldn't get full array of users" })
    })
});

router.get('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    
    Users.getById(id)
    .then(specificUser => {
        res.status(200).json(specificUser)
    })
    .catch(err => {
        res.status(500).json({ error: "Couldnt get specific User from DB" })
    })
});

router.post('/', validateUser, (req, res) => {
    const newUser = req.body;

    Users.insert(newUser)
    .then(newUser => {
        res.status(201).json(newUser)
    })
    .catch(err => {
        res.status(500).json({ error: "Couldnt add User to DB" })
    })
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    Users.update(id, changes)
    .then(updatedUser => {
        res.status(200).json(updatedUser)
    })
    .catch(err => {
        res.status(500).json({ error: "Couldnt update specific User from DB" })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    
    Users.remove(id)
    .then(specificUser => {
        res.status(200).json(specificUser)
    })
    .catch(err => {
        res.status(500).json({ error: "Couldnt delete specific User from DB" })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    req.body.user_id = req.params.id
    const newPost = req.body;

    Posts.insert(newPost)
    .then(post => {
        res.status(201).json(post)
    })
    .catch(err => {
        res.status(500).json({ error: "Couldn't add new Post to Existing user" })
    })
});


router.get('/:id/posts', validateUserId, (req, res) => {
    const { id } = req.params;

    Users.getUserPosts(id)
    .then(specificIdsPosts => {
        console.log(specificIdsPosts)
        res.status(200).json(specificIdsPosts)
    })
    .catch(err => {
        res.status(500).json({ error: "Couldn't retrieve Posts for User" })
    })

});





//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;

    Users.getById(id)
    .then(user => {
        if(user){
            next();
        }else{
            res.status(400).json({ message: "invalid user id" })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "Couldn't attempt to validate UserId" })
    })
};

function validateUser(req, res, next) {
    const newUser = req.body;

    if(!newUser.name){
        res.status(400).json({ message: "missing user data" })
    }else{
        next();
    }
};

function validatePost(req, res, next) {
    const newPost = req.body;

    if(!newPost.text){
        res.status(400).json({ message: "missing required text field" })
    }else{
        next();
    }
};

module.exports = router;
