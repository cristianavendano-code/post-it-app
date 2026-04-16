const router = require('express').Router();
const postItController = require('../controllers/postItController');

router.post('/', postItController.createPostIt);

module.exports = router;