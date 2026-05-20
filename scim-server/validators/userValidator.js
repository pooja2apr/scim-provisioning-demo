const validator = require("validator");

function validateUser(data) {

    if (!data.userName || data.userName.trim() === "") {

        return "Username is required";

    }

    if (
        !data.emails ||
        !Array.isArray(data.emails) ||
        data.emails.length === 0
    ) {

        return "At least one email is required";

    }

    const email = data.emails[0].value;

    if (!validator.isEmail(email)) {

        return "Valid email is required";

    }

    return null;

}

module.exports = validateUser;