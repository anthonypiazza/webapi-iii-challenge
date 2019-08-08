// code away!
const express = require('express');

const postsRouter = require('./posts/postRouter');

const usersRouter = require('./users/userRouter');

const server = express();

server.use(express.json());

server.use('/posts', postsRouter)

server.use('/users', usersRouter)

server.listen(8000, () => console.log('Listening on Port 8000'))