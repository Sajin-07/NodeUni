const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');
const multer = require('multer')


//main
// router.post('/signup', async(req,res)=>{
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

/******************************************************************************************multer *******************************************************************/
// Two types storage ase to save image: diskStorage and memoryStorage.
// option 1: Set up multer to store files in /uploads folder
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); //jei folder a saave hobe oi folder er path pass hoy
//     },
//     filename: (req, file, cb) => {
//         const Suffix = Date.now();
//         cb(null, Suffix + '-' + file.originalname);
//     }
// });

// option2:  Configure multer to store files in memory as Buffer
const storage = multer.memoryStorage(); //file memory te save thakbe instead of disk. DB te save korar jonno use hoy.
/* 
memoryStorage: Files are stored in memory as Buffer objects instead of being saved to disk.
In this case, the file is converted into a Buffer and will be saved as a Base64-encoded string in the database.
*/

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// File filter to allow only JPEG and PNG images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only JPEG and PNG images are allowed!'), false); // Reject the file
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB limit
    fileFilter: fileFilter
});

// const upload = multer({storage});

router.post('/signup', upload.single('photo'), async (req, res) => { //input field name 'photo' na hoye onno name hoile oita dite hoito
    try {
        // Destructure the fields from req.body
        const { studentId, name, age, department, enrolled, courses, username, password } = req.body;
        const photobase64 = req.file ? req.file.buffer.toString('base64') : null; //In Node.js, a Buffer is a class designed to handle binary data. It provides a way to interact with raw binary data streams
        // Create a new Student instance
        const newStudent = new Student({
            studentId,
            name,
            age,
            department,
            enrolled,
            courses,
            username,
            password,
            photo: photobase64 // Save img to db as base64 string
        });

        // Save to the database
        const saveIn = await newStudent.save();
        console.log('Data saved successfully');
        res.status(200).json(saveIn);

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* read this 
Data Flow of /signup

1. User Form Submission:	User submits data (req.body) and a file (req.file) via the /signup API.
2. File Processing:	Multer processes the file, storing it in memory as a Buffer in binary format.
3. Data Validation:	Mongoose validates the schema (e.g., required fields, enum values).
4. Password Hashing:	The pre middleware hashes the password before saving.
5. Database Save:	A new Student document is saved to MongoDB.
6. Response to User	On success, the saved document is returned; on error, a failure message is sent.

*/


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