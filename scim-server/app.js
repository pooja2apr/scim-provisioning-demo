require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Group = require("./models/Group");
const authenticateSCIM = require("./middleware/auth");
const writeLog = require("./utils/logger");
const validateUser = require("./validators/userValidator");
const validateGroup = require("./validators/groupValidator");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json({
    type: [
        "application/json",
        "application/scim+json"
    ]
}));

console.log("Starting server...");

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log("Mongo Error:", err);
});




app.get("/", (req, res) => {
  res.send("SCIM Server Running");
});

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    // Simple demo credentials

    if (
        username !== "admin" ||
        password !== "password123"
    ) {

        return res.status(401).json({
            message: "Invalid credentials"
        });

    }

    const token = jwt.sign(

        {
            username: username
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "7d"
        }

    );

    res.json({
        token
    });

});

app.post("/Users",authenticateSCIM, async (req, res) => {
    console.log("BODY:", req.body);
    const validationError = validateUser(req.body);

if (validationError) {

    return res.status(400).json({
        error: validationError
    });

}

    try {

        const newUser = new User({

    userName: req.body.userName,

    name: {

        givenName: req.body.name?.givenName,

        familyName: req.body.name?.familyName

    },

    emails: req.body.emails || [],

    active: req.body.active !== undefined
        ? req.body.active
        : true

});
   

        const savedUser = await newUser.save();

        res.set("Content-Type", "application/scim+json");

        res.status(201).json({

    schemas: [
        "urn:ietf:params:scim:schemas:core:2.0:User"
    ],

    id: savedUser._id.toString(),
    externalId: savedUser._id.toString(),

    userName: savedUser.userName,

    active: savedUser.active,

    name: savedUser.name,

    emails: savedUser.emails,

    meta: {
	resourceType: "User"

    }

});

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});

app.get("/Users", authenticateSCIM, async (req, res) => {

    try {

        const filter = req.query.filter;

        // FILTER SUPPORT

        if (filter) {

            const match =
                filter.match(/userName eq "(.+)"/);

            if (match) {

                const username = match[1];

                const users = await User.find({

                    userName: username

                });

                return res.json({

                    schemas: [
                        "urn:ietf:params:scim:api:messages:2.0:ListResponse"
                    ],

                    totalResults: users.length,

                    startIndex: 1,

                    itemsPerPage: users.length,

                    Resources: users.map(user => ({

                        schemas: [
                            "urn:ietf:params:scim:schemas:core:2.0:User"
                        ],

                        id: user._id.toString(),

                        externalId:
                            user._id.toString(),

                        userName: user.userName,

                        active: user.active,

                        name: user.name,

                        emails: user.emails,

                        meta: {
                            resourceType: "User"
                        }

                    }))

                });

            }

        }

        // RETURN ALL USERS

        const users = await User.find();

        res.json({

            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:ListResponse"
            ],

            totalResults: users.length,

            startIndex: 1,

            itemsPerPage: users.length,

            Resources: users.map(user => ({

                schemas: [
                    "urn:ietf:params:scim:schemas:core:2.0:User"
                ],

                id: user._id.toString(),

                externalId:
                    user._id.toString(),

                userName: user.userName,

                active: user.active,

                name: user.name,

                emails: user.emails,

                meta: {
                    resourceType: "User"
                }

            }))

        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
app.get("/Users/:id", authenticateSCIM, async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

            return res.status(400).json({
                error: "Invalid user id"
            });

        }

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                error: "User not found"
            });

        }

        res.json({

            schemas: [
                "urn:ietf:params:scim:schemas:core:2.0:User"
            ],

            id: user._id.toString(),
            externalId: user._id.toString(),

            userName: user.userName,

            active: user.active,

            name: user.name,

            emails: user.emails

        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});
app.put("/Users/:id", authenticateSCIM, async (req, res) => {

    try {

        console.log("PUT BODY:");
        console.log(JSON.stringify(req.body, null, 2));

        const updatedUser = await User.findByIdAndUpdate(

            req.params.id,

            {

                userName: req.body.userName,

                name: {

                    givenName: req.body.name?.givenName,

                    familyName: req.body.name?.familyName

                },

                emails: req.body.emails || [],

                active: req.body.active

            },

            { new: true }

        );

        if (!updatedUser) {

            return res.status(404).json({
                error: "User not found"
            });

        }

        res.json({

            schemas: [
                "urn:ietf:params:scim:schemas:core:2.0:User"
            ],

            id: updatedUser._id.toString(),
            externalId: updatedUser._id.toString(),

            userName: updatedUser.userName,

            active: updatedUser.active,

            name: updatedUser.name,

            emails: updatedUser.emails,

            meta: {
                resourceType: "User"
            }

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});
app.delete("/Users/:id",authenticateSCIM, async (req, res) => {

    try {

        const deletedUser = await User.findByIdAndDelete(
            req.params.id
        );
        writeLog(
    "DELETE_USER",
    deletedUser.userName
);

        if (!deletedUser) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json({
            message: "User deleted successfully",
            user: deletedUser
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});


app.patch("/Users/:id", authenticateSCIM, async (req, res) => {

    try {

        console.log("PATCH BODY:");
        console.log(JSON.stringify(req.body, null, 2));

        const operations = req.body.Operations;

        if (!operations || !Array.isArray(operations)) {

            return res.status(400).json({
                error: "Invalid PATCH payload"
            });

        }

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                error: "User not found"
            });

        }

        operations.forEach(operation => {

            const op =
                operation.op?.toLowerCase();

            const path = operation.path;

            const value = operation.value;

            // REPLACE

            if (op === "replace") {

                if (path === "active") {

                    user.active = value;

                }

                if (path === "name.givenName") {

                    user.name.givenName = value;

                }

                if (path === "name.familyName") {

                    user.name.familyName = value;

                }

                if (path === "displayName") {

                    user.displayName = value;

                }

            }

        });

        await user.save();

        res.json({

            schemas: [
                "urn:ietf:params:scim:schemas:core:2.0:User"
            ],

            id: user._id.toString(),

            externalId: user._id.toString(),

            userName: user.userName,

            active: user.active,

            name: user.name,

            emails: user.emails,

            meta: {
                resourceType: "User"
            }

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/Groups",authenticateSCIM, async (req, res) => {
    const validationError = validateGroup(req.body);

if (validationError) {

    return res.status(400).json({
        error: validationError
    });

}

    try {
        
        const newGroup = new Group({

            displayName: req.body.displayName,

            members: req.body.members || []

        });

        await newGroup.save();
        writeLog(
    "CREATE_GROUP",
    newGroup.displayName
);

       res.status(201).json({

    schemas: [
        "urn:ietf:params:scim:schemas:core:2.0:Group"
    ],

    id: newGroup._id.toString(),

    displayName: newGroup.displayName,

    members: newGroup.members,

    meta: {
        resourceType: "Group"
    }

});

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/Groups", authenticateSCIM,async (req, res) => {

    try {

        const groups = await Group.find();

        res.json({
            totalResults: groups.length,
            Resources: groups
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});
app.get("/Groups/:id", authenticateSCIM, async (req, res) => {

    try {

        const group = await Group.findById(req.params.id);

        if (!group) {

            return res.status(404).json({
                error: "Group not found"
            });

        }

        res.json({

            schemas: [
                "urn:ietf:params:scim:schemas:core:2.0:Group"
            ],

            id: group._id.toString(),

            displayName: group.displayName,

            members: group.members,

            meta: {
                resourceType: "Group"
            }

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});
app.put("/Groups/:id", authenticateSCIM, async (req, res) => {

    try {

        console.log("GROUP PATCH BODY:");
        console.log(JSON.stringify(req.body, null, 2));

        const group = await Group.findById(req.params.id);

        if (!group) {

            return res.status(404).json({
                error: "Group not found"
            });

        }

        const operations =
            req.body.Operations || [];

        operations.forEach(operation => {

            const op =
                operation.op?.toLowerCase();

            // ADD MEMBERS

            if (
                op === "add" &&
                operation.path === "members"
            ) {

                const newMembers =
                    operation.value || [];

                group.members.push(...newMembers);

            }

            // REMOVE MEMBERS

            if (
                op === "remove" &&
                operation.path === "members"
            ) {

                const removeMembers =
                    operation.value || [];

                group.members =
                    group.members.filter(member =>

                        !removeMembers.some(
                            removeMember =>

                                removeMember.value ===
                                member.value
                        )
                    );

            }

        });

        await group.save();

        res.json({

            schemas: [
                "urn:ietf:params:scim:schemas:core:2.0:Group"
            ],

            id: group._id.toString(),

            displayName: group.displayName,

            members: group.members,

            meta: {
                resourceType: "Group"
            }

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});
app.delete("/Groups/:id",authenticateSCIM, async (req, res) => {

    try {

        const deletedGroup = await Group.findByIdAndDelete(
            req.params.id
        );

        if (!deletedGroup) {

            return res.status(404).json({
                message: "Group not found"
            });

        }

        res.json({
            message: "Group deleted successfully",
            group: deletedGroup
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});