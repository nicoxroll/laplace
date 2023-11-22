import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import BadSmells from './BadSmells';

interface IssueDetailsDialogProps {
  issue: any;
  openModal: boolean;
  handleCloseModal: () => void;
}

const IssueDetailsDialog: React.FC<IssueDetailsDialogProps> = ({ issue, openModal, handleCloseModal }) => {
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
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ issue: issue.body }),
    });
    const data = await response.json();
    return data.result;
  }

  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles del Issue</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Título: {issue.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Cuerpo del Issue: {issue.body}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Respuesta de OpenAI:
        </Typography>
        <BadSmells smells={responseArray} />
        <Button onClick={handleCloseModal} color="primary" variant="contained">
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailsDialog;