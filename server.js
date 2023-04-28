require('dotenv').config()
const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash = require('express-flash');
const session = require('express-session');

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)


const PORT = process.env.port || 4000

//we are storing user data on local variable
const users =[]


//setting view engine
app.set('view engine', 'ejs')

//access information from form
app.use(express.urlencoded({extended:false}))


//Flash messages
app.use(flash());


//session

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session())


app.get('/', (req, res) => {
    res.render('index',{users:users})
})


//login page - get call
app.get('/login', (req, res) => {
    res.render('login')
})


//login page - post call
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true //this will allow us to have a flash message
}))



//register page - get call
app.get('/register', (req, res) => {
    res.render('register')
})


//regiser page - post call
app.post('/register', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password:hashedPassword
        })
        res.redirect('/login')
    } catch (err) {
        res.redirect('/register')
    }
    console.log(users)
})


app.listen(PORT, () => {
    console.log('Server running ')
})