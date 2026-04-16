const express = require('express');
const postItmodel = require('../models/postItModel');

// function to create a new post-it
async function createPostIt(req, res) {
    const data = req.body;
    const insertId = await postItmodel.create(req.body);
    res.status(201).json({ message: "post-it created successfully", id: insertId });
};

module.exports = {
    createPostIt
};