const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const taskModel = require('../models/taskModel');
const { json } = require('body-parser');


// function createNewTask (req,res) {
//     let newTask = {
//         id: uuidv4(),
//         text: req.body.newTask,
//         completed: false
//     }

//     let databaseTasksJSON = fs.readFileSync('./public/storage.json')
//     let tasksJSON = JSON.parse(databaseTasksJSON)
//     tasksJSON.push(newTask);

//     fs.writeFile('./public/storage.json', JSON.stringify(tasksJSON, null, 2), (err) => {
//         if(err){
//             console.log('Error'+ err)
//         }
//     })
//     res.redirect('/tasks');
// }

async function createNewTask (req,res) {
    
    const task = await taskModel.create({
        text: req.body.newTask,
        completed: false
    })
    
    res.redirect('/tasks');
    }

// function getTasks(req, res){
//     let databaseTasksJSON = fs.readFileSync('./public/storage.json', 'utf8')
//     let tasksJSON = JSON.parse(databaseTasksJSON)
//     res.render('index', {tasks: tasksJSON});
// }

async function getTasks(req, res){
    const tasks = await taskModel.find({});
    res.send(tasks)
    //res.render('index', {task: tasks});
    
}

async function updateTask(req,res){
    await taskModel.updateOne({_id: req.body.id},{ $set: { completed: req.body.completed }});
    res.json({
        message: "Task updated!",
        success: true
    })
}

// function getTask(req, res){
//     let databaseTasksJSON = fs.readFileSync('./public/storage.json', 'utf8')
//     let tasksJSON = JSON.parse(databaseTasksJSON)
//     let task = tasksJSON.filter(element => element.id === req.params.id)
//     res.end(JSON.stringify(task));
// }

//task controller function
async function deleteTask(req, res) {
    // let databaseTasksJSON = fs.readFileSync('./public/storage.json', 'utf8');
    // let tasksJSON = JSON.parse(databaseTasksJSON);
    // let found = tasksJSON.findIndex(element => element.id === req.params.id ? element: null);
    // if (found !== null) {
    //     tasksJSON.splice(found,1);
    //     fs.writeFile('./public/storage.json', JSON.stringify(tasksJSON, null, 2), (err) => {
    //         if(err) console.log('Error'+ err)
    //     })
    //     res.json({
    //         success: true,
    //         redirect_path: "/tasks",
    //     })

    // } else {
    //     res.json({
    //         success: false
    //     })
    // }
    try{

        const tasksToDelete = req.body.ids
        if (tasksToDelete.length > 1){
            for (task of tasksToDelete){
                await taskModel.deleteOne({_id: task});
            }
        } else {
            await taskModel.deleteOne( {_id: tasksToDelete[0]});
        }

        res.json({
            message: "Task deleted!",
            success: true
    });
    }
    catch(error){
        console.log(error)
    }
    
}

async function deleteAllTasks(req, res){
    try{ 
        const result = await taskModel.deleteMany({})
        res.json({
            message: "Tasks deleted!",
            success: true
    });
       
    }
    catch(error) {
        console.log(error);
        
    };
}

module.exports = {createNewTask, getTasks, deleteTask, deleteAllTasks, updateTask};