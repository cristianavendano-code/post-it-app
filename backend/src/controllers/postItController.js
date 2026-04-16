const express = require('express');
const postItModel = require('../models/postItModel');

// function to get all post-its
async function getAllPostIts(req, res) {
    try {
        const postIts = await postItModel.getAll();
        res.json(postIts);
        if (!postIts.length) {
            res.status(404).json({ message: "No post-its found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving post-its", error: error.message });
    } 
};

// function to get a post-it by ID
async function getPostItById(req, res) {
    try {
        const id = req.params.id;
        const postIt = await postItModel.getById(id);
        if (postIt) {
            res.json(postIt);
        } else {
            res.status(404).json({ message: "post-it not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving post-it", error: error.message });
    }
};

// function to create a new post-it
async function createPostIt(req, res) {
    try {
        const data = req.body;
        const insertId = await postItModel.create(req.body);
        res.status(201).json({ message: "post-it created successfully", id: insertId });
        if (!data.content || !data.userId) {
            res.status(400).json({ message: "Content and userId are required" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error creating post-it", error: error.message });
    }
};

// function to update a post-it
async function updatePostIt(req, res) {
    try {
        const id = req.params.id;
        const data = req.body;
        const updatedId = await postItModel.update(id, data);
        res.json({ message: "post-it updated successfully", id: updatedId });
        if (!data.content) {
            res.status(400).json({ message: "Content is required" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating post-it", error: error.message });
    }
};

// function to delete a post-it
async function deletePostIt(req, res) {
    try {
        const id = req.params.id;
        await postItModel.remove(id);
        res.json({ message: "post-it deleted successfully", id: id });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post-it", error: error.message });
    }
};

module.exports = {
    getAllPostIts,
    getPostItById,
    createPostIt,
    updatePostIt,
    deletePostIt
};