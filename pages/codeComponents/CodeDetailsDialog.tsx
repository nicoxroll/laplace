import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Button, CircularProgress } from '@mui/material';
import BadSmells from '../BadSmells';


interface CodeDetailsDialogProps {
  code: any;
  codeContent: any;
  openModal: boolean;
  handleCloseModal: () => void;
}

const CodeDetailsDialog: React.FC<CodeDetailsDialogProps> = ({ code, codeContent, openModal, handleCloseModal }) => {
  const [response, setResponse] = useState<string>('');
  const [responseArray, setResponseArray] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchOpenAIResponse() {
      try {
        setIsLoading(true); // Iniciar el estado de carga

        const openAIResponse = await fetchOpenAI();
        setResponse(openAIResponse);
      } catch (error) {
        console.error('Error fetching OpenAI response:', error);
        // Manejar el error según tus necesidades
      } finally {
        setIsLoading(false); // Finalizar el estado de carga
      }
    }

    if (openModal) {
      fetchOpenAIResponse();
    }
  }, [openModal]);

  useEffect(() => {
    if (response) {
      const array = response.split('-*- ');
      setResponseArray(array);
    }
  }, [response]);

  async function fetchOpenAI() {
    const response = await fetch('/api/testing2', {
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
          Codigo:

          <pre style={{ whiteSpace: 'pre-wrap' }}>{codeContent}</pre>

        </Typography>
        <Typography variant="h6" gutterBottom>
          Respuesta de OpenAI:
        </Typography>
        {isLoading ? (
           <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
           <CircularProgress />
         </div>
        ) : (
          <div style={{ marginTop: '10px' }}>
            <BadSmells smells={responseArray} />
          </div>
        )}
        <div style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }}></div> {/* Línea divisoria */}
        <Button onClick={handleCloseModal} color="primary" variant="contained" style={{ marginTop: '10px' }}>
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CodeDetailsDialog;