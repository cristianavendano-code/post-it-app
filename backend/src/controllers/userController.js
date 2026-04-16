const express = require('express');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

module.exports = {
    createUser
}