
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected: ${connect.connection.host}`)
    } catch (error) {
        console.log(error);

    }
}

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },

    password: {
        type: String,
        required: true
    }

})

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },

    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User', // Assuming you have a User model
    //     required: true,
    // },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("users", LoginSchema)
const Note = mongoose.model("notes", NoteSchema);


module.exports = {
    connectDB,
    User,
    Note
}





