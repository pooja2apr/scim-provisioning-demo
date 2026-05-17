const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({

    displayName: {
        type: String,
        required: true
    },

    members: [
        {
            userId: String,
            display: String
        }
    ]

});

module.exports = mongoose.model("Group", GroupSchema);