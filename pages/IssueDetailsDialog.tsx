import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Button, CircularProgress, Box } from '@mui/material';
import BadSmells from './BadSmells';
import { Search } from '@mui/icons-material';

interface IssueDetailsDialogProps {
  issue: any;
  openModal: boolean;
  handleCloseModal: () => void;
}

const IssueDetailsDialog: React.FC<IssueDetailsDialogProps> = ({ issue, openModal, handleCloseModal }) => {
  const [response, setResponse] = useState<string>('');
  const [responseArray, setResponseArray] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const initializeVariables = () => {
    setResponseArray([]);
    setImageUrl(null);
  };

  useEffect(() => {
    if (openModal) {
      initializeVariables();
      extractImageUrl();
    }
  }, [openModal]);

  useEffect(() => {
    if (response) {
      const array = response.toString().split(',');
      setResponseArray(array);
    } 
  }, [response]);

  const extractImageUrl = () => {
    const regex = /\bhttps?:\/\/\S+\b/;
    const match = issue.body.match(regex);
    if (match && match.length > 0) {
      setImageUrl(match[0]);
    }
  };

  async function fetchOpenAI() {
    const content = issue.title + ' --- ' + issue.body;
    const response = await fetch('/api/testing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ issue: content }),
    });
    console.log(content);
    const data = await response.json();
    return data.result;
  }

  const handleAnalyzeClick = async () => {
    try {
      setResponseArray([])
      setLoading(true);
      const openAIResponse = await fetchOpenAI();
      setResponse(openAIResponse);
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      // Manejar el error según tus necesidades
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles del Issue</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ overflowY: 'auto', flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {issue.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{issue.body}</pre>
          </Typography>
          {imageUrl && (
            <img src={imageUrl} alt="Issue Image" style={{ maxWidth: '100%', marginTop: '10px' }} />
          )}
        </div>

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <CircularProgress />
          </div>
        )}
        <BadSmells smells={responseArray} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Button
            onClick={handleAnalyzeClick}
            color="primary"
            variant="contained"
            startIcon={<Search />}
            style={{ marginRight: '10px' }}
          >
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

export default IssueDetailsDialog;