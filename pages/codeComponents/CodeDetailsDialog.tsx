import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import BadSmells from '../BadSmells';

interface CodeDetailsDialogProps {
  code: any;
  codeContent: any;
  openModal: boolean;
  handleCloseModal: () => void;
}

const IssueDetailsDialog: React.FC<CodeDetailsDialogProps> = ({ code, codeContent, openModal, handleCloseModal }) => {
  const [response, setResponse] = useState<string>('');
  const [responseArray, setResponseArray] = useState<string[]>([]);

  useEffect(() => {
    async function fetchOpenAIResponse() {
      try {
        const openAIResponse = await fetchOpenAI();
        setResponse(openAIResponse);
      } catch (error) {
        console.error('Error fetching OpenAI response:', error);
        // Manejar el error según tus necesidades
      }
    }

    if (openModal) {
      fetchOpenAIResponse();
    }
  }, [openModal]);

  useEffect(() => {
    if (response) {
      const array = response.split(',');
      setResponseArray(array);
    }
  }, [response]);


  
  async function fetchOpenAI() {
    
    const response = await fetch('/api/code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ issue: codeContent }),
    });
    const data = await response.json();
    return data.result;
  }

  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles del Codigo</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Título: {code.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Codigo: {codeContent}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Respuesta de OpenAI:
        </Typography>
        {responseArray}

      <div style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }}></div> {/* Línea divisoria */}
      <Button onClick={handleCloseModal} color="primary" variant="contained" style={{ marginTop: '10px' }}>
        Cerrar
      </Button>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailsDialog;