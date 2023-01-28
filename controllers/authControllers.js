const express = require('express')
const router = express.Router();
const static = require('serve-static');
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require("../models/userModel");
const app = express();
app.use(express.json());
app.set('view engine', 'ejs')
app.use(static(__dirname + '/public'));

const { BadRequest, NotFound } = require('../utils/errors');

//LOGIN FUNCTIONS

async function getLoginPage(req, res) {// if the user is logged in, he/she shouldn't be able to see login page
    res.render('login.ejs');
}

async function postLogin(req, res, next){
    const {email, password} = req.body
    console.log(email)
    
    try{
      if (!email || !password) {
        throw new NotFound("Email or password missing");
      }
    passport.authenticate('local', {
      successRedirect: '/tasks',
      failureRedirect: '/auth/login',
      failureFlash: true
    })(req, res, next)
    }
    catch(err){
        next(err)
    }
  }


  //REGISTRATION FUNCTIONS

  async function getRegisterPage(req, res){// if the user is logged in, he/she shouldn't be able to see login page
    res.render('register.ejs');
  }

  async function postRegister(req, res, next){
    const {name, email, password} = req.body;
 
    try{
     if(!name || !email || !password){
      throw new BadRequest('Missing field name, email or password')
     
    }
    const userDB = await User.findOne({"email": req.body.email})
     if (userDB){
       throw new BadRequest("There's already a user with that email")
     }
 
     const hashedPassword = await bcrypt.hash(req.body.password, 10);
 
     const user = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: hashedPassword
     });
 
       // register and redirect to login
 
       res.send(user)
       //res.redirect('/auth/login')
     }
     catch(err){
       // console.log(err);
       next(err)
       //res.redirect('/')
     }
   }

   //LOGOUT FUNCTION

   function logout (req, res, next){ //delete the session id
    
    req.logout(function(err) {
      if (err) { return next(err); }
      res.clearCookie("connect.sid", {path: "/"})
      req.session.destroy((err)=>{
        if(err){
          return next(err)
        }
        res.redirect('/auth/login');
      })
      //res.redirect('/');
    });
    //logged out and redirect to login
  }


module.exports = {getLoginPage, postLogin, getRegisterPage, postRegister, logout};