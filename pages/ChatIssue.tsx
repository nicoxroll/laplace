import React, { useState } from 'react';
import { Button, Input, CardContent, Card, Avatar, Grid } from '@mui/material';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  return (
    <Grid container spacing={2} style={{ height: '100%' }}>
      <Grid item xs={3} style={{ borderRight: '1px solid #ccc' }}>
        <div style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Messages</h2>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Input
              style={{ paddingLeft: '32px' }}
              placeholder="Search messages..."
              type="search"
            />

          </div>
          <div style={{ maxHeight: 'calc(100% - 150px)', overflowY: 'auto' }}>
            {messages.map((message, index) => (
              <Card key={index} variant="outlined" style={{ marginBottom: '8px' }}>
                <CardContent>
                  <p>{message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Grid>
      <Grid item xs={9}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div
            style={{
              borderBottom: '1px solid #ccc',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar style={{ marginRight: '16px' }}>U</Avatar>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Agente GPT</h2>
              <span style={{ fontSize: '12px', color: 'green' }}>Online</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    backgroundColor: '#87CEEB',
                    color: 'black',
                    padding: '8px 12px',
                  }}
                >
                  <p>{message}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #ccc', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Input
                style={{ flex: 1, marginRight: '16px' }}
                placeholder="Type a message..."
                value={message}
                onChange={handleInputChange}
              />
              <Button variant="contained" onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default ChatComponent;