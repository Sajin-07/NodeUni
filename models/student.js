const mongoose = require('mongoose');

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

})

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;