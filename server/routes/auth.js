const express = require('express');
const router = express.Router();
const { Auth, localVariables, verifyUser } = require('../middleware/Auth.js');
const { login, register, getUser, updateUser, verifyOTP, createResetSession, resetPassword } = require("../controller/appcontroller");
const registerMail = require('../controller/mailer.js');

//POST method
router.post('/register', register);
router.post('/registerMail', registerMail);
router.post('/authenticate', verifyUser, async (req, res) => { return res.status(200).send("Successful") });
router.post('/login', login);


// //get Method
router.get('/user/:username', getUser);
router.get('/generateOTP', verifyUser, localVariables, generateOTP);
router.get('/verifyOTP', verifyUser, verifyOTP);
router.get('/createResetSession', createResetSession);


// //PUT method
router.put('/updateUser', Auth, updateUser);
router.put('/resetPassword', verifyUser, resetPassword);

module.exports = router;