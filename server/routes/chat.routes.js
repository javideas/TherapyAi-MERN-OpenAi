const express = require('express');
const router = express.Router();
const Message = require('../models/Message.model');
const { isAuthenticated } = require("../middleware/jwt.middleware");


router.get("/messages", isAuthenticated, async (req, res, next) => {
    try {
      const messages = await Message.find({ user: req.payload._id })
        .sort({ createdAt: 1 })
        .populate("user", "username");
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
});


router.post("/messages", isAuthenticated, async (req, res, next) => {
    const { text } = req.body;
    const userId = req.payload._id; // retrieve the user's _id from the token payload
  
    try {
      const newMessage = await Message.create({ text, user: userId });
      res.status(201).json(newMessage);
    } catch (error) {
      next(error);
    }
  });
  
  

module.exports = router;
