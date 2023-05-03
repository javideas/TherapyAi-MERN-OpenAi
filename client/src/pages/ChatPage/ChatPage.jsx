import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const response = await axios.get("/chat/messages", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setMessages(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        await axios.post(
          "/chat/messages",
          { text: newMessage },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setNewMessage("");
        // Add the new message to the messages state
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: newMessage },
        ]);
      }
    } catch (error) {
      console.error(error);
      // Display an error message to the user
      alert("Failed to send message. Please try again later.");
    }
  };

  useEffect(() => {
    // Fetch messages only if the messages state is empty
    if (messages.length === 0) {
      fetchMessages();
    }
  }, [fetchMessages, messages]);

  return (
    <div>
      <h1>Chat Page</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message.text}</li>
        ))}
      </ul>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatPage;
