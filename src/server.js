const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
require('dotenv').config();
const { connectDB, User } = require('./config')

const app = express();

// Middleware to parse incoming URL-encoded data from requests.
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Set ejs as view engine
app.set('view engine', 'ejs');

connectDB();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("Dashboard")
})


app.get('/Login', (req, res) => {
    res.render("Login")
})


app.get('/Register', (req, res) => {
    res.render("Register")
})

app.get('/Home', (req, res) => {
    res.render("Home")
})

app.get('/add', (req, res)=>{
    res.render("add")
})



// Register User
app.post("/Register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user already exists
        const existUser = await User.findOne({ name: username });
        if (existUser) {
            return res.send("User already exists");
        }

        // Hash the password
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user document using Mongoose
        const newUser = new User({
            name: username,
            password: hashPassword
        });


        await newUser.save();
        console.log("User registered successfully!");

        // Redirect to login page 
        res.redirect("/Login");

    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user");
    }
});

// Login user
app.post("/Login", async (req, res) => {
    try {

        const { username, password } = req.body;
        // Checks if the user exists
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.send("Username not found");

        }
        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {

            res.redirect("/Home");

        } else {
            res.send("Wrong password");

        }
    } catch {
        console.error(error);
        res.status(500).send("Error during login");
    }
})

// app listening on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})