const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true
    },

    name: {

        givenName: String,

        familyName: String

    },

    emails: [
        {
            value: String
        }
    ],

    active: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model("User", UserSchema);