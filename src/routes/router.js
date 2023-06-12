const router = require('express').Router();
const { getUsers, getParticularUser, createUser } = require('../controllers/users.js');

router.get('/users', getUsers);
router.get('/users/:userId', getParticularUser);
router.post('/users', (createUser));

module.exports = router;
