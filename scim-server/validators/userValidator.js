const validator = require("validator");

function validateUser(data) {

    if (!data.userName || data.userName.trim() === "") {

        return "Username is required";

    }

    if (!data.email || !validator.isEmail(data.email)) {

        return "Valid email is required";

    }

    return null;

}

module.exports = validateUser;