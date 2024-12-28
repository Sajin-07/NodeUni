const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = mongoose.Schema({
    studentId: {
        type: Number,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    department:{
        type: String,
        enum: ['CSE', 'EEE', 'ARC'],
        required: true
    },
    enrolled:{
        type: Boolean,
        default: false
    },
    courses: {
        required: true,
        type: Array
    },
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    photo: {
        type: String
    }

})


studentSchema.pre('save', async function(next){ // it means password DB te save korar age hash korbo then next() call diye DB te save korbo. pre middleware function mongoose provide kore.
    const student = this; //means do this for all users/documents

    // Hash the password only if it has been modified (or is new)
    if(!student.isModified('password')) return next();//If the password has not been modified, the middleware skips the hashing process by calling next() and exiting early. When return next(); is executed, the control immediately leaves the middleware function, bypassing the subsequent code, including the try-catch block.

    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(student.password, salt);
        
        // Override the plain password with the hashed one
        student.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

/*  
student.isModified('password'): This is a Mongoose method that checks if the password field has been changed or if this is a new document.
Why check?
To avoid re-hashing an already hashed password if the document is being updated and the password field is not modified.
If not modified: next() is called to continue with the save operation without modifying the password.  */


studentSchema.methods.comparePassword = async function(enteredPassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

// How this compare function works?
/*The given method, comparePassword, is a custom instance method added to the studentSchema. It is used to compare a provided password (entered by the user during login or authentication) with the hashed password stored in the database. 

---methods: This is how you define instance methods in Mongoose schemas. These methods are available on all documents created with the schema.
---enteredPassword: This is the plain-text password entered by the user (e.g., during login).
---this.password: Refers to the hashed password stored in the database for the current document.

Internally, first retrieve salt from this.password and it hashes the enteredPassword with the same salt used for the stored hash (this.password) and checks if the two hashes match.

*/
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;



/*
Data Flow Overview

1. User Form Submission:	User submits data (req.body) and a file (req.file) via the /signup API.
2. File Processing:	Multer processes the file, storing it in memory as a Buffer.
3. Data Validation:	Mongoose validates the schema (e.g., required fields, enum values).
4. Password Hashing: The pre middleware(studentSchema.pre) hashes the password before saving.
5. Database Save:	A new Student document is saved to MongoDB.
6. Response to User	On success, the saved document is returned; on error, a failure message is sent.


*/