import React, { useState } from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip } from '@mui/material';

interface BadSmellsProps {
  smells: string[];
}

const BadSmells: React.FC<BadSmellsProps> = ({ smells }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      {smells.map((smell, index) => (
        <Chip key={index} label={smell} color="primary" onClick={handleOpenDialog} />
      ))}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Bad Smells</DialogTitle>
        <DialogContent dividers>
          {smells.map((smell, index) => (
            <Typography key={index} variant="body1" style={{ margin: '4px' }}>
              {smell}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BadSmells;