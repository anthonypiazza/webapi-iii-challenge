const express = require('express');
const Posts = require('./postDb');
const router = express.Router();


router.get('/', (req, res) => {
    Posts.get()
    .then(postArray => {
        res.status(200).json(postArray)
    })
    .catch(err => {
        res.status(500).json({ error: "Couldn't connect to backend to get Posts." })
    })
});

router.get('/:id', validatePostId, (req, res) => {
    const { id } = req.params;
    
    Posts.getById(id)
    .then(selectedPost => {
            res.status(200).json(selectedPost)
    })
    .catch(err => {
        //triggers if improper .then() syntax or function error
        res.status(500).json({ error: "Couldn't connect to backend to attempt GetByID" })
    })
});

router.delete('/:id', validatePostId, (req, res) => {
    const { id } = req.params;

    Posts.remove(id)
    .then(selectedPost => {
        res.status(200).json({ message: "This post has successfully been deleted." })
    })
    .catch(err => {
        res.status(500).json({ error: "Couldn't connect to backend to remove Post by ID." })
    })
});

router.put('/:id', validatePost, validatePostId, (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    
    Posts.update(id, changes)
    .then(changedPost => {
        res.status(200).json(changes)
    })
    .catch(err => {
        res.status(500).json({ error: "Couldn't connect to backend to update Post by ID." })
    })
});

// custom middleware

function validatePostId(req, res, next) {
    const { id } = req.params;
    Posts.getById(id)
    .then(postExists => {
        if(postExists){
            next();
        }else{
            res.status(400).json({ message: "invalid post id" })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "Couldn't attempt to validatePostId" })
    })
};

function validatePost(req, res, next) {
    const newPost = req.body;

    if(!newPost.text || !newPost.user_id){
        res.status(400).json({ message: "missing required text field" })
    }else{
        next();
    }
};


module.exports = router;