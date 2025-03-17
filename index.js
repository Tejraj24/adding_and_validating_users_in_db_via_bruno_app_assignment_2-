const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://tejraj487:adding@cluster0.nzn4n.mongodb.net/")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// Login Endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check for empty fields
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));