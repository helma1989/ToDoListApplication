
const express = require('express')
const router = express.Router();
const passport = require('passport')
const initializePassport = require('../config/passport-config')
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const authController = require('../controllers/authControllers')





initializePassport(passport);

router.get('/login', checkNotAuthenticated, authController.getLoginPage)

router.post('/login', checkNotAuthenticated, urlencodedParser, authController.postLogin)

router.get('/register', checkNotAuthenticated, authController.getRegisterPage)

router.post('/register',urlencodedParser, authController.postRegister)

router.delete('/logout', authController.logout)


//helper middleware
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {    //a passport function
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}


  module.exports = router;
