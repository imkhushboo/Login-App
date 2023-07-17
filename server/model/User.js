const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please provide unique username"],
        unique: [true, "Username Exists"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String
    },
    mobile: {
        type: Number,
    },
    address: {
        type: String,
    },
    profile: {
        type: String
    }
});
const User = mongoose.model("user", UserSchema);
User.createIndexes();
module.exports = User;
