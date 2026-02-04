const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");
dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const testUser = {
            username: "testuser_" + Date.now(),
            email: "test_" + Date.now() + "@example.com",
            password: "password123",
            gender: "male"
        };

        console.log("Attempting to save user:", testUser);
        const user = new User(testUser);
        await user.save();
        console.log("User saved successfully!");

        const token = user.generateToken();
        console.log("Token generated:", typeof token === 'string' ? "Success" : "Failed: " + token);

        await mongoose.connection.close();
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

test();
