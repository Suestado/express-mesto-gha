const router = require('express').Router();
const auth = require('../middlewares/auth');
const validateUserPost = require('../middlewares/validateUserPost');
const validateCardPost = require('../middlewares/validateCardPost');
const { errors } = require('celebrate');
const errorsGlobalHandler = require('../middlewares/errorsGlobalHandler');

const {
  logIn,
  getUserMe,
  getUsers,
  getParticularUser,
  createUser,
  changeUserData,
  changeUserAvatar,
} = require('../controllers/users');
const {
  getCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
} = require('../controllers/cards');
const badRoute = require('../controllers/404page');

router.post('/signin', logIn);
router.post('/signup', validateUserPost, createUser);

router.use(auth);

router.get('/users/me', getUserMe);
router.get('/users', getUsers);
router.get('/users/:userId', getParticularUser);
router.patch('/users/me', changeUserData);
router.patch('/users/me/avatar', changeUserAvatar);

router.get('/cards', getCards);
router.post('/cards', validateCardPost, createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', setLike);
router.delete('/cards/:cardId/likes', deleteLike);

router.use('*', badRoute);

router.use(errors());
router.use(errorsGlobalHandler);

module.exports = router;
