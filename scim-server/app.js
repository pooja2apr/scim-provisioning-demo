require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Group = require("./models/Group");
const authenticateSCIM = require("./middleware/auth");

const app = express();

app.use(express.json());

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
app.post("/Users",authenticateSCIM, async (req, res) => {

    try {

        const newUser = new User({

            userName: req.body.userName,

            givenName: req.body.givenName,

            familyName: req.body.familyName,

            email: req.body.email

        });

        await newUser.save();

        res.status(201).json(newUser);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/Users",authenticateSCIM, async (req, res) => {

    try {

        const users = await User.find();

        res.json({
            totalResults: users.length,
            Resources: users
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.patch("/Users/:id",authenticateSCIM, async (req, res) => {

    try {

        const updatedUser = await User.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        if (!updatedUser) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (err) {

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

app.post("/Groups",authenticateSCIM, async (req, res) => {

    try {

        const newGroup = new Group({

            displayName: req.body.displayName,

            members: req.body.members || []

        });

        await newGroup.save();

        res.status(201).json(newGroup);

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
app.patch("/Groups/:id",authenticateSCIM, async (req, res) => {

    try {

        const updatedGroup = await Group.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        if (!updatedGroup) {

            return res.status(404).json({
                message: "Group not found"
            });

        }

        res.json({
            message: "Group updated successfully",
            group: updatedGroup
        });

    } catch (err) {

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