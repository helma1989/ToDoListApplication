const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const userModel = require('../models/userModel');


async function getUsers(req, res) {
    const users = await userModel.find({});
    //console.log(users);
    res.send(users);
}

async function getUserByName(req,res){
    const user = await userModel.findOne({name: req.params.name});
    console.log(user)
    //user.parent = "63bd3930e94237ab282fb0ca";
    //await user.save();
    res.send(user)
}

async function deleteUser(req,res){
    try{
        const user = await userModel.deleteOne({name: req.params.name});
        console.log(user);
        
        res.json({
            message: "User deleted!",
            success: true
    });
    }
    catch(error){
        console.log(error)
    }
    
}

async function createUser(req, res){
    console.log(req.body)
    try{
        const user1 = await userModel.create({
            name: req.body.user_name,
            email: req.body.user_email,
            age: req.body.user_age,
            parent: req.body.parent
            
        });
        console.log(user1);
        console.log('User is created');
        res.redirect('/')
    } 
    catch(error){
        console.log(error.message);
        res.sendStatus(404);
        //res.redirect('/')
        return
    }
    
    
}




module.exports = {createUser, getUsers, getUserByName, deleteUser}

