import React, { useState } from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CodeSearch = ({ smells }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSmell, setSelectedSmell] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenDialog = (smell) => {
    setSelectedSmell(smell);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetchOpenAI(selectedSmell);
      setSelectedSmell(selectedSmell + '\n\n----------\n\n' + response);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchOpenAI = async (codeContent) => {
    const response = await fetch('/api/agentSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ issue: codeContent }),
    });

    const data = await response.json();
    return data.result;
  };

  return (
    <div>
      {smells.map((smell, index) => (
        <Chip
          key={index}
          label={smell}
          color="primary"
          style={{ backgroundColor: 'violet', color: 'white', margin: '4px', cursor: 'pointer' }}
          onClick={() => handleOpenDialog(smell)}
        />
      ))}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Información Detallada</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" style={{ margin: '4px' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{selectedSmell}</pre>
          </Typography>
        </DialogContent>
        <DialogActions>
          <div style={{ display: 'flex', flexGrow: 1 }}>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Button startIcon={<SearchIcon />} onClick={handleSearch} style={{ marginRight: 'auto' }}>
                Buscar
              </Button>
            )}
          </div>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CodeSearch;