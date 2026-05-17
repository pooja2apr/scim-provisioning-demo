const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true
    },

    givenName: String,

    familyName: String,

    email: String,

    active: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model("User", UserSchema);