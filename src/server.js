const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const { connectDB, User, Note } = require('./config')
const session = require('express-session');
require('dotenv').config();


const app = express();

// Middleware to parse incoming URL-encoded data from requests.
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Set ejs as view engine
app.set('view engine', 'ejs');

// connect database
connectDB();

app.use(express.static('public'));

// routes

app.get('/', (req, res) => {
    res.render("Dashboard")
})


app.get('/Login', (req, res) => {
    res.render("Login")
})


app.get('/Register', (req, res) => {
    res.render("Register")
})



app.get('/Home', async (req, res) => {
    try {
        // Fetch notes from the database
        const notes = await Note.find();

        // Render the Home view and pass the notes
        res.render("Home", { notes });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching notes");
    }
});

app.get('/add', (req, res) => {
    res.render("add")
})

app.get('/note/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).send("Note not found");
        }

        res.render('view', { note });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving note");
    }
});

// Search route to filter notes by title or body
app.get('/search', async (req, res) => {
    const searchTerm = req.query.q; // `q` will be the query parameter
    try {
        const searchResults = await Note.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } }, // case-insensitive search
                { body: { $regex: searchTerm, $options: 'i' } }   // case-insensitive search
            ]
        });

        res.render('Home', { notes: searchResults });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching search results");
    }
});

app.get('/logout', (req, res) => {
    if (req.session) {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error logging out.');
            } else {
                // Clear the cookie and redirect to login
                res.clearCookie('connect.sid');
                res.redirect('/Login');
            }
        });
    } else {
        res.redirect('/Login');
    }
});

app.post('/logout', (req, res) => {
    console.log('Session before destroying:', req.session);  // Log session data before destroying
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/login');
    });
});

app.use((req, res, next) => {
    console.log(req.session);
    next();
});


app.post('/Home/add', async (req, res) => {
    try {
        const { title, body } = req.body;

        // Create a new note
        const newNote = new Note({
            title,
            body
        });

        // Save the note to the database
        await newNote.save();

        console.log("Note added successfully!");

        // Redirect to the Home page after saving the note
        res.redirect('/Home');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding note");
    }
});


// Register User
app.post("/Register", async (req, res) => {
    try {
        const { username, password, Confirm } = req.body;

        if (password !== Confirm) {
            return res.send('Password do not match')
        }

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

// Route to update a note
app.post('/note/update/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, body } = req.body;

        await Note.findByIdAndUpdate(noteId, { title, body });

        res.redirect('/Home'); // Redirect to Home after updating
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating note");
    }
});




// Route to delete a note
app.post('/note/delete/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        await Note.findByIdAndDelete(noteId);

        res.redirect('/Home'); // Redirect to Home after deletion
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting note");
    }
});

app.use(session({
    secret: 'youcan_put_the_blameonme',  // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }   // For production, set secure to true with HTTPS
}));




// app listening on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})