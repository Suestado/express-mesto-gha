const router = require('express').Router();

const {
  getUsers,
  getParticularUser,
  createUser,
  updateUserInfo,
} = require('../controllers/users');
const {
  getCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
} = require('../controllers/cards');
const badRoute = require('../controllers/404page');

router.get('/users', getUsers);
router.get('/users/:userId', getParticularUser);
router.post('/users', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserInfo);

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', setLike);
router.delete('/cards/:cardId/likes', deleteLike);

router.use('*', badRoute);

module.exports = router;
