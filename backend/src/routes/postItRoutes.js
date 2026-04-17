const router = require('express').Router();
const postItController = require('../controllers/postItController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, postItController.getAllPostIts);

router.get('/:id', authMiddleware, postItController.getPostItById);

router.post('/', authMiddleware, postItController.createPostIt);

router.put('/:id', authMiddleware, postItController.updatePostIt);

router.delete('/:id', authMiddleware, postItController.deletePostIt);

module.exports = router;