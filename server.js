const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body

// const St = require('./models/student') 
const note = require('./note');
const fs = require('fs');
const os = require('os');
const Student = require('./models/student');

const passport = require('./auth');

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', {session: false})

console.log("hi from server");
console.log(note.temp);
note.add(60,60)


const os1 = os.userInfo();
const user = os1.username
// console.log(user);

// const file = fs.appendFile('greet.txt',`Hi Mr ${user} welcome to meta verse \n`, ()  => console.log('file created'));
// const file1 = fs.appendFile('greet.txt',`Hi Mr ${user} \n`, ()  => console.log('file created'));

app.get('/web',(req,res) =>{
    res.send('Welcome to the Express.js Tutorial')
})

app.get('/sjs', (req,res) =>{
    let obj = {
        name: 'sajin',
        id: 20
    }
    res.send(obj)
})

app.get('/git', (req,res) =>{
    fetch('https://api.github.com/users/sajin-07')
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        // res.send(`Hi, ${data.name} this is your ligin info-->${data.login} `)
        res.send(data)
    })
    .catch((error) => console.log(error))

    
})


// app.post('/student', async(req,res)=>{
//     try {
//         const data = req.body;
//         const newStudent = new Student(data);
        
//         const saveIn = await newStudent.save();
//         console.log('Data saved');
//         res.status(200).json(saveIn)
        
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json('Internal server Error')
        
        
//     }

// })

// //DB theke kichu khujte hoile jei model dia schema banaisi oi model naame diya khujte hobe. Do all other operations using model name.
// app.get('/fetch', async(req,res)=>{
//     try {
//         const data = await Student.find()
//         console.log('Data fetched');
//         res.status(200).json(data)
        
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json('Internal server Error')
        
        
//     }

// })
const studentRoutes = require('./routes/studentRoutes');

app.use('/',localAuthMiddleware,studentRoutes);
// app.use('/',studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});