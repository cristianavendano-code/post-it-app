require('dotenv').config();
const express = require('express');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

//function to create a new user
async function createUser(req, res) {
    try {
        const data = req.body;
        if (!data.username || !data.email || !data.password) {
            return res.status(400).json({ message: "Username, email and password are required" });
        }

        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        const insertId = await userModel.create(req.body);

        return res.status(200).json({ message: "User created successfully", id: insertId});

    } catch (error) {
        return res.status(500).json({ message: "Error creating user", error: error.message});
    }
};

// function to login a user
async function loginUser(req, res) {
    try {
        const data = req.body;
        if (!data.email || !data.password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.getByEmail(data.email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        return res.status(200).json({ message: "Login successful", token: token });

    } catch (error) {
        return res.status(500).json({ message: "Error logging in user", error: error.message});
    }
};


module.exports = {
    createUser,
    loginUser
}