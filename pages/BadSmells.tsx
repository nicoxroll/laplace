import React, { useState } from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip } from '@mui/material';

interface BadSmellsProps {
  smells: string[];
}

const BadSmells: React.FC<BadSmellsProps> = ({ smells }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSmell, setSelectedSmell] = useState('');

  const handleOpenDialog = (smell: string) => {
    setSelectedSmell(smell);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      {smells && smells.map((smell, index) => (
        <Chip
          key={index}
          label={smell}
          color="primary"
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
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BadSmells;