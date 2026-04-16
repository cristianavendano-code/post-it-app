const express = require('express');

// function to create a new post-it
async function createPostIt(req, res) {
    const data = req.body;
    console.log('Received data:', data);
    res.status(201).json({ message: 'API connection successful', data });
};

module.exports = {
    createPostIt
};