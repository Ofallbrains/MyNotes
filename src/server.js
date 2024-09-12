const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')

const app = express();

// Set ejs as view engine
app.set('view engine', 'ejs');

app.use(express.static('public'));


app.get('/Login', (req, res) => {
    res.render("Login")
})


app.get('/Register', (req, res) => {
    res.render("Register")
})
 

// app listening on port 3000
const port = 5000;
app.listen(port, () =>{
   console.log(`Server running on port ${port}`)
})