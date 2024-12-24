const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Student = require('./models/student');

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // console.log('Received credentials:', username, password);
        const user = await Student.findOne({ username }); //replace Person with your mongoose model name.
        if (!user)
            return done(null, false, { message: 'Incorrect username.' });
        
        const isPasswordMatch = await user.comparePassword(password);
        if (isPasswordMatch)
            return done(null, user);
        else
            return done(null, false, { message: 'Incorrect password.' })
    } catch (error) {
        return done(error);
    }
}));

module.exports = passport; 
