import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Button, CircularProgress, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import CodeScan from './CodeSearch';

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

  const initializeVariables = () => {
    setResponse('');
    setResponseArray([]);
    setIsLoading(false);
  };

  useEffect(() => {
    initializeVariables();
  }, [codeContent]);

  useEffect(() => {
    if (response) {
      const array = response.split('-*- ');
      setResponseArray(array);
    }
  }, [response]);

  async function fetchOpenAIResponse() {
    try {
      initializeVariables();
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

  async function fetchOpenAI() {
    const response = await fetch('/api/agentScan', {
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
      <DialogContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ overflowY: 'auto', flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {code && code.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{codeContent}</pre>
          </Typography>
        </div>

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <CircularProgress />
          </div>
        )}
        <CodeScan smells={responseArray} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Button onClick={fetchOpenAIResponse} color="primary" variant="contained" startIcon={<Search />} style={{ marginRight: '10px' }}>
            Analizar
          </Button>
          <Button onClick={handleCloseModal} color="primary" variant="contained" style={{ backgroundColor: '#003366' }}>
            Cerrar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CodeDetailsDialog;