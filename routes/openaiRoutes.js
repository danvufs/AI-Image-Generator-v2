const express = require('express');
const { generateImage } = require('../controllers/openaiController');
const router = express.Router();

/* A route that is listening for a post request to the /generateimage endpoint. When it receives a post
request, it will call the generateImage function. */
router.post('/generateimage', generateImage);

module.exports = router;
