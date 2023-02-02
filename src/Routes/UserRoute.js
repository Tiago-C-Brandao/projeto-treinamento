const { Router } = require('express');
const { get, getUsers, signup, login, updateUser, deleteUser } = require('../Controllers/UserController');
const { verifyJWT } = require('../Services/VerifyJWT')
const router = Router();


router.get('/', get);
router.get('/getusers', getUsers);

router.post('/signup', signup);
router.post('/login', login);

router.patch('/user/:user_id', updateUser)

router.delete('/user/:user_id', verifyJWT, deleteUser )

module.exports = router;