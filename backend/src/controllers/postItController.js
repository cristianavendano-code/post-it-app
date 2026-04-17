const express = require('express');
const postItModel = require('../models/postItModel');

// function to get all post-its
async function getAllPostIts(req, res) {
    try {
        const userId = req.user.id;
        const postIts = await postItModel.getAll(userId);
        if (!postIts.length) {
            return res.status(404).json({ message: "No post-its found" });
        }

        return res.json(postIts)

    } catch (error) {
        return res.status(500).json({ message: "Error retrieving post-its", error: error.message });
    } 
};

// function to get a post-it by ID
async function getPostItById(req, res) {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "ID of the post-it is required" });
        }

        const postIt = await postItModel.getById(id, userId);
        if (!postIt) {
            return res.status(404).json({ message: "post-it not found or unauthorized" });
        }
        
        return res.json(postIt);

    } catch (error) {
        return res.status(500).json({ message: "Error retrieving post-it", error: error.message });
    }
};

// function to create a new post-it
async function createPostIt(req, res) {
    try {
        const content = req.body.content;
        const userId = req.user.id;
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const insertId = await postItModel.create(content, userId);
        
        return res.status(201).json({ message: "post-it created successfully", id: insertId });

    } catch (error) {
        return res.status(500).json({ message: "Error creating post-it", error: error.message });
    }
};

// function to update a post-it
async function updatePostIt(req, res) {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "ID of the post-it is required" });
        }
        
        const content = req.body.content;
        if (!content ) {
            return res.status(400).json({ message: "Content is required" });
        }

        const updatedId = await postItModel.update(id, content, userId);
        if (!updatedId) {
            return res.status(404).json({ message: "post-it not found or unauthorized" });
        }
        
        return res.json({ message: "post-it updated successfully", id: updatedId });
                
    } catch (error) {
        return res.status(500).json({ message: "Error updating post-it", error: error.message });
    }
};

// function to delete a post-it
async function deletePostIt(req, res) {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "ID of the post-it is required" });
        }

        const deletedId = await postItModel.remove(id, userId);
        if (!deletedId) {
            return res.status(404).json({ message: "post-it not found" });
        }

        return res.json({ message: "post-it deleted successfully", id: id });

    } catch (error) {
        return res.status(500).json({ message: "Error deleting post-it", error: error.message });
    }
};

module.exports = {
    getAllPostIts,
    getPostItById,
    createPostIt,
    updatePostIt,
    deletePostIt
};