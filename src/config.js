
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

const collection = mongoose.model("users", LoginSchema)


module.exports = {
    connectDB,
    collection
}





