import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Button, CircularProgress, Box, Chip } from '@mui/material';
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
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const initializeVariables = () => {
    setResponseArray([]);
    setImageUrls([]);
  };

  useEffect(() => {
    if (openModal) {
      initializeVariables();
      extractImageUrls();
    }
  }, [openModal]);

  useEffect(() => {
    if (response) {
      const array = response.toString().split(',');
      setResponseArray(array);
    } 
  }, [response]);
  const extractImageUrls = () => {
    if (issue.body && issue.body.trim() !== '') {
      const regex = /\bhttps?:\/\/\S+\b/g;
      const matches = issue.body.match(regex);
      if (matches && matches.length > 0) {
        setImageUrls(matches);
      }
    } else {
      console.log('El campo "body" está vacío');
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
        <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
  <Typography variant="h6" gutterBottom>
    {issue.title}
  </Typography>
</a>
          <Typography variant="body1" gutterBottom>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{issue.body}</pre>
          </Typography>
          {imageUrls.map((imageUrl, index) => {
  const isImage = /\.(jpeg|jpg|gif|png)$/.test(imageUrl) || imageUrl.includes('asset');
  return isImage ? (
    <img key={index} src={imageUrl} alt={`Issue ${index}`} style={{ maxWidth: '100%', marginTop: '10px' }} />
  ) :  (
    <Chip
      key={index}
      component="a"
      href={imageUrl}
      target="_blank"
      rel="noopener noreferrer"
      label={imageUrl}
      style={{ marginTop: '10px', backgroundColor: 'violet', color: 'white' }}
    />
  );
})}
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