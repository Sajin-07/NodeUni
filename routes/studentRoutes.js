const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

router.post('/signup', async(req,res)=>{
    try {
        const data = req.body;
        const newStudent = new Student(data);
        
        const saveIn = await newStudent.save();
        console.log('Data saved');
        res.status(200).json(saveIn)
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server Error')
        
        
    }

})


// Login Route
router.post('/login', async(req, res) => {
    try{
        // Extract username and password from request body
        const {username, password} = req.body;

        // Find the user by username
        const user = await Student.findOne({username: username});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        console.log("User Data: ", userData);

        const userId = userData.id;
        const user = await Student.findById(userId);

        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})






//DB theke kichu khujte hoile jei model dia schema banaisi oi model naame diya khujte hobe. Do all other operations using model name.
router.get('/fetch',jwtAuthMiddleware, async(req,res)=>{
    try {
        const data = await Student.find()
        console.log('Data fetched');
        res.status(200).json(data)
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server Error')
        
        
    }

})


router.get('/fetch/:deptType', async(req,res)=>{
    try {
        const dept = req.params.deptType
        if (dept == 'CSE' || dept == 'EEE' || dept == 'ARC'  ){
            data = await Student.find({department: dept})
            console.log('response fetched');
            res.status(200).json(data)

        }else{
            res.status(404).json({error: 'Invalid department type'});
        }
        
    } catch (error) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.put('/fetch/:id',jwtAuthMiddleware, async(req,res)=>{
    try {
        stID = req.params.id
        const updatedStudentData = req.body;
        const response = await Student.findByIdAndUpdate(stID, updatedStudentData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        })


        if (!response) {
            return res.status(404).json({ error: 'Student not found' });
        }
        console.log('data updated');
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
        
    }
})


router.delete('/fetch/:id', async (req, res) => {
    try{
        const stID = req.params.id; // Extract the Student's ID from the URL parameter
        
        // Assuming you have a Student model
        const response = await Student.findByIdAndDelete(stID);
        if (!response) {
            return res.status(404).json({ error: 'Student not found' });
        }
        console.log('data delete');
        res.status(200).json({message: 'Student Deleted Successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})
//comment added
module.exports = router