function validateGroup(data) {

    if (!data.displayName || data.displayName.trim() === "") {

        return "Group displayName is required";

    }

    if (data.members) {

        for (const member of data.members) {

            if (!member.value || !member.display) {

                return "Each member must have userId and display";

            }

        }

    }

    return null;

}

module.exports = validateGroup;