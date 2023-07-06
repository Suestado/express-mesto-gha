const router = require('express').Router();
const auth = require('../middlewares/auth');
const validateUserDataJoi = require('../middlewares/validateUserDataJoi');
const validateCardDataJoi = require('../middlewares/validateCardDataJoi');
const validateUserGetByIDJoi = require('../middlewares/validateUserGetByIDJoi');
const validateCardGetByIDJoi = require('../middlewares/validateCardGetByIDJoi');
const validateUserUpdateJoi = require('../middlewares/validateUserUpdateJoi');

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

router.post('/signin', validateUserDataJoi, logIn);
router.post('/signup', validateUserDataJoi, createUser);

router.use(auth);

router.get('/users/me', getUserMe);
router.get('/users', getUsers);
router.get('/users/:userId', validateUserGetByIDJoi, getParticularUser);
router.patch('/users/me', validateUserUpdateJoi, changeUserData);
router.patch('/users/me/avatar', validateUserUpdateJoi, changeUserAvatar);

router.get('/cards', getCards);
router.post('/cards', validateCardDataJoi, createCard);
router.delete('/cards/:cardId', validateCardGetByIDJoi, deleteCard);
router.put('/cards/:cardId/likes', validateCardGetByIDJoi, setLike);
router.delete('/cards/:cardId/likes', validateCardGetByIDJoi, deleteLike);

router.use('*', badRoute);

module.exports = router;
