const router = require('express').Router();
const postItController = require('../controllers/postItController');

router.get('/', postItController.getAllPostIts);

router.get('/:id', postItController.getPostItById);

router.post('/', postItController.createPostIt);

router.put('/:id', postItController.updatePostIt);

router.delete('/:id', postItController.deletePostIt);

module.exports = router;