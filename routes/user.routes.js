const express = require('express');
const router = express.Router();
const validateToken = require('../utils').validateToken;

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/user.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/signUp', user_controller.signUp);
router.post('/signIn', user_controller.signIn);
router.get('/profile', validateToken, user_controller.getProfile);
router.post('/post/like', validateToken, user_controller.likePost);
router.post('/post/dislike', validateToken, user_controller.dislike);
router.get('/posts', user_controller.getPosts);

module.exports = router;
