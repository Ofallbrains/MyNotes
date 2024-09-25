const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const { connectDB, User, Note } = require('./config')
const jwt = require('jsonwebtoken');
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
        res.render("Home", { notes, isSearch: false });
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

// Search notes by title or body
app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    try {
        const searchResults = await Note.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { body: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        res.render('Home', { notes: searchResults, isSearch: true });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching search results");
    }
});

app.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error logging out.');
            } else {

                res.clearCookie('connect.sid');
                res.redirect('/Login');
            }
        });
    } else {
        res.redirect('/Login');
    }
});




// Register User
app.post("/Register", async (req, res) => {
    try {
        const { username, password, Confirm } = req.body;

        if (password !== Confirm) {
            return res.send('Password do not match')
        }

        // Checks if the user already exists
        const existUser = await User.findOne({ name: username });
        if (existUser) {
            return res.send("User already exists");
        }

        // Hash the password
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // Creates a new user document using Mongoose
        const newUser = new User({
            name: username,
            password: hashPassword
        });

        await newUser.save();
        console.log("User registered successfully!");

        // Redirects to login page 
        res.redirect("/Login");

    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user");
    }
});

// Login user
app.post('/Login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.send("Username not found");
        }

        // Compares passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.redirect("/Home");

        } else {
            res.status(401).send("Wrong password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during login");
    }
});


app.post('/logout', (req, res) => {
    console.log('Session before destroying:', req.session);
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
        const { title, body, } = req.body;

        // Create a new note
        const newNote = new Note({
            title,
            body,

        });

        await newNote.save();

        console.log("Note added successfully!");

        res.redirect('/Home');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding note");
    }
});


// Updating the note
app.post('/note/update/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, body } = req.body;

        await Note.findByIdAndUpdate(noteId, { title, body });

        res.redirect('/Home');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating note");
    }
});

// Deleting a note
app.post('/note/delete/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        await Note.findByIdAndDelete(noteId);

        res.redirect('/Home');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting note");
    }
});


// app listening on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

