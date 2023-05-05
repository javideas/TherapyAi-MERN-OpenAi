const express = require('express');
const router = express.Router();
const Message = require('../models/Message.model');
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

router.get("/diagnosis", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    let messages = await Message.find({ user: userId })
      .sort({ createdAt: 1 })
      .populate("user", "username");

    if (messages.length === 0) {
      // Create the first message for the user
      const firstMessage = await Message.create({
        text: "TherapistAi: Hi there! How can I help you today?",
        user: userId,
      });
      messages.push(firstMessage);
    }

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
});


router.post("/diagnosis", isAuthenticated, async (req, res, next) => {
  const { text } = req.body;
  const userId = req.payload._id; // retrieve the user's _id from the token payload

  try {
    
    let history = "";
    const userMessages = await Message.find({ user: userId });
    if (userMessages !== undefined) {
      history = userMessages.reduce((accumulator, message) => {
        return accumulator + message.text + "\n";
      }, "");
    } else {
      console.log("History empty");
    }

    try {
        const order = "//Psychological diagnosis by the Therapist: ";
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt:
            `//Elaborate, from the next conversation between a Therapist and a patient, a Psychological diagnosis//
            ` +
            history +
            order +
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

        if (!reply) {
            console.warn("Empty reply from OpenAI API");
            return res.status(500).send("An error occurred");
        }
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