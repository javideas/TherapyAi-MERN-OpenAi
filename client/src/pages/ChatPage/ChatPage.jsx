import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import '../Styles.css';


function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatFrame = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const response = await axios.get("/chat/messages", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setMessages(response.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage) {
      return; // Do not proceed if newMessage is empty
    }
  
    // Add user message to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `Patient: ${newMessage}` },
    ]);
  
    // Clear the newMessage state
    setNewMessage("");
  
    // Set isTyping to true
    setIsTyping(true);
  
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const response = await axios.post(
          "/chat/messages",
          { text: newMessage },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const aiMessage = response.data;
        
        // Set isTyping to false
        setIsTyping(false);
        
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: aiMessage },
        ]);
        scrollToBottom();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again later.");
  
      // Set isTyping to false in case of error
      setIsTyping(false);
    }
  };
  
  

  const handleDeleteMessages = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to reset the chat? All your message history will be deleted and TherapistAi will forget all the information provided."
    );
  
    if (!confirmation) {
      return;
    }
  
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        await axios.delete("/chat/messages", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
  
        // Create the first message for the user and update the state
        const firstMessage = {
          text: "TherapistAi: Hi there! How can I help you today?",
        };
        setMessages([firstMessage]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete messages. Please try again later.");
    }
  };   

  useEffect(() => {
    if (messages.length === 0) {
      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatFrame.current) {
      chatFrame.current.scrollTop = chatFrame.current.scrollHeight;
    }
  };

  const messageType = (message) => {
    if (message.startsWith("Patient: ")) {
      return "patient";
    } else if (message.startsWith("TherapistAi: ")) {
      return "therapist";
    }
  };

  const removePrefix = (message) => {
    return message.replace(/^(Patient: |TherapyAi: )/, "");
  };

  return (
    <div className="outer mt-3">
      <div className="chatWithPic d-flex justify-content-center">
        <div className="d-flex flex-row justify-content-center">
          <div className="box-chat d-flex flex-column p-3 gap-2 justify-content-end rounded-4">
            <div id="frame" ref={chatFrame}>
            <ul id="messages-ul" className="list-unstyled">
              {messages.map((message, index) => {
                const type = messageType(message.text);
                return (
                  <div
                    key={index}
                    className={`d-flex flex-row justify-content-${type === "patient" ? "end" : "start"}`}
                  >
                    <li
                      className={`${type} rounded-2 m-2 p-2`}
                      style={{ maxWidth: "250px" }}
                    >
                      {removePrefix(message.text)}
                    </li>
                  </div>
                );
              })}
              {isTyping && (
                <div className="d-flex flex-row justify-content-start">
                  <li className="therapist rounded-2 m-2 p-2" style={{ maxWidth: "250px" }}>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </li>
                </div>
              )}
            </ul>
            </div>
            <div className="d-flex flex-row justify-content-center m-0">
              <form onSubmit={handleMessageSubmit} className="m-0 container">
                <div className="row gap-2">
                <textarea
                  autoFocus
                  type="text"
                  id="message"
                  name="message"
                  maxLength="280"
                  className="col-10 rounded-3 border-0 flex-grow-1"
                  style={{ minHeight: "50px", maxHeight: "80px", outline: "none" }}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleMessageSubmit(e);
                    }
                  }}
                ></textarea>
                  <button type="submit" className="col-1 rounded-3 border-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="#569fec"
                      className="bi bi-send-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                    </svg>
                  </button>
                  <button onClick={handleDeleteMessages} className="btn btn-danger">
                    Reset Chat
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="profilePic d-flex flex-column justify-content-start">
          {/* Replace "{{profilePic}}" with the appropriate variable or URL */}
          <a href="/profile">
            {/* <img src="{{profilePic}}" alt="profilePic" width="120px" className="rounded-circle" /> */}
          </a>
          <div className="d-flex justify-content-center">
            <a href="/profile" className="logo fs-5 header">
              Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
