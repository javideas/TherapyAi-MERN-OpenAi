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

router.delete("/messages", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    await Message.deleteMany({ user: userId });
    res.status(200).json({ message: "Messages deleted successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/messages", isAuthenticated, async (req, res, next) => {
  const { text } = req.body;
  const userId = req.payload._id; // retrieve the user's _id from the token payload

  try {
    const newMessage = await Message.create({ text: "Patient: " + text, user: userId });

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
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt:
          `//Imagine a conversation between a therapist (called "TherapyAi") and a patient. I will provide the patient's dialogue and you only will provide the therapist dialogue. Don't autocomplete the patient's dialogue. Create only the dialogue for the therapist taking in count the patient's answer and the patient's info. If the patient shows any kind of harmful behaviour, please advise the patient to seek for professional real help. If the patient ask you to answer with more than 256 characters, you can't. Always answer in less than 256 characters//
          ` +
          history +
          newMessage.text +
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