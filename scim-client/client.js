const axios = require("axios");

const BASE_URL = "http://localhost:3000";


// CREATE USER

async function createUser() {

    try {

        const response = await axios.post(

            `${BASE_URL}/Users`,

            {
                userName: "john",
                givenName: "John",
                familyName: "Doe",
                email: "john@example.com"
            }

        );

        console.log("\nUser Created:");

        console.log(response.data);

    } catch (err) {

        console.log(err.message);

    }

}


// FETCH USERS

async function fetchUsers() {

    try {

        const response = await axios.get(
            `${BASE_URL}/Users`
        );

        console.log("\nAll Users:");

        console.log(response.data);

    } catch (err) {

        console.log(err.message);

    }

}


// UPDATE USER

async function updateUser(userId) {

    try {

        const response = await axios.patch(

            `${BASE_URL}/Users/${userId}`,

            {
                active: false
            }

        );

        console.log("\nUser Updated:");

        console.log(response.data);

    } catch (err) {

        console.log(err.message);

    }

}


// DELETE USER

async function deleteUser(userId) {

    try {

        const response = await axios.delete(
            `${BASE_URL}/Users/${userId}`
        );

        console.log("\nUser Deleted:");

        console.log(response.data);

    } catch (err) {

        console.log(err.message);

    }

}


// MAIN FLOW

async function runSCIMClient() {

    // Create User
    await createUser();

    // Fetch Users
    const usersResponse = await axios.get(
        `${BASE_URL}/Users`,{
            headers: {
        Authorization: "Bearer scim-secret-token"
    }
        });

    const users = usersResponse.data.Resources;

    if (users.length > 0) {

        const userId = users[0]._id;

        // Update User
        await updateUser(userId);

        // Delete User
        await deleteUser(userId);

    }

    // Final Fetch
    await fetchUsers();

}

runSCIMClient();