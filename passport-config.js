const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')




const initialize = (passport,getUserByEmail,getUserById) => {

    const authenticateUser = async(email,password,done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null,false,{message:'No User Found'})
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null,user)
            } else {
                return done(null,false,{message:'Password incorrect'})
            }
        } catch(e) {
            return done(e)
        }
    }



    passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser))

    //serialize - user.id is the actual serialise version of the user
    passport.serializeUser((user, done) => {
        done(null,user.id)
    });

    //deserialize
    passport.deserializeUser((id, done) => {
        return done(null,getUserById(id))
    })


}


module.exports = initialize