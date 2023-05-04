const express = require('express');
const router = express.Router();
const Message = require('../models/Message.model');
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

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

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt:
          `//Imagine a conversation between a therapist (called "TherapyAi") and a patient. I will provide the patient's dialogue and you only will provide the therapist dialogue. Don't autocomplete the patient's dialogue. Create only the dialogue for the therapist taking in count the patient's answer and the patient's info. If the patient shows any kind of harmful behaviour, please advise the patient to seek for professional real help. If the patient ask you to answer with more than 256 characters, you can't. Always answer in less than 256 characters//
        ` +
          newMessage +
          '" \n\n',
        max_tokens: 120, // 4 characters by token, 0.75 words per token
        temperature: 0.5,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
      });

      const reply = response.data.choices[0].text;
      console.log("Reply from OpenAI API:", reply);

      await Message.create({ text: reply, user: userId });

      // Return both the newMessage and savedMessage in the response
      res.status(201).json(reply);
    } catch (error) {
      console.error("An error occurred", error);
      res.status(500).send("An error occurred");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;