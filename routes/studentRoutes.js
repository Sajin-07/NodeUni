const express = require('express');
const router = express.Router();
const Student = require('../models/student');

router.post('/student', async(req,res)=>{
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

//DB theke kichu khujte hoile jei model dia schema banaisi oi model naame diya khujte hobe. Do all other operations using model name.
router.get('/fetch', async(req,res)=>{
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

router.put('/fetch/:id', async(req,res)=>{
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