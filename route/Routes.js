const express = require('express');
const router = express.Router();
const userController = require('../controller/ShikhaController');
// const validator =require('../validator/Validator');
const authorization = require('../middleware/authorization')

router.post('/signup',  userController.createuser);
router.post('/userlogin', userController.login);
router.get('/getuser', userController.getalluser);
// router.get('/users/:id', userController.findone);
router.get('/user/:id', authorization.authenticateToken, userController.findpk);
router.put('/user/:id', authorization.authenticateToken, userController.updateuser);
router.delete('/user/:id', authorization.authenticateToken, userController.deleteuser);



router.post('/forgot', userController.forgetPassword);
router.get('/redirect', userController.Resetoutput);
router.patch('/reset', authorization.authenticateToken, userController.ResetPass);

module.exports = router;