import React, { useState, useEffect } from 'react';
import {  CircularProgress, Box, Typography } from '@mui/material';

const styles = {
  chatContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '400px',
    height: '500px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ccc',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#003366',
    color: '#fff',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
  },
  chatContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  },
  messageContainer: {
    marginBottom: '10px',
  },
  userMessage: {
    background: '#e1ffc7',
    padding: '5px 10px',
    borderRadius: '5px',
    display: 'inline-block',
  },
  assistantMessage: {
    background: '#fff',
    padding: '5px 10px',
    borderRadius: '5px',
    display: 'inline-block',
    textAlign: 'right',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    marginRight: '10px',
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '3px',
  },
  sendButton: {
    backgroundColor: '#003366',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

const ChatCode = ({ response, handleCloseChat }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (response) {
      setMessages((prevMessages) => [...prevMessages, response]);
      setIsLoading(false);
    }
  }, [response]);

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, inputMessage]);
      setInputMessage('');
      setIsLoading(true);
    }
  };

  return (
    <div>
      <div style={styles.header}>
    
        <Typography variant="h6">Chat</Typography>
       
      </div>
      <div>
        {messages.map((message, index) => (
          <div key={index} style={styles.messageContainer}>
            <Typography variant="body1" style={styles.userMessage}>
              {message}
            </Typography>
          </div>
        ))}
        {isLoading && (
          <div style={styles.messageContainer}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress size={20} />
            </Box>
          </div>
        )}
      </div>
      <div style={styles.inputContainer}>
        <input style={styles.input} type="text" value={inputMessage} onChange={handleInputChange} />
        <button style={styles.sendButton} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatCode;