// CodeDetailsDialog.jsx
import React from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import BadSmells from '../BadSmells';

interface CodeDetailsDialogProps {
  code: any;
  codeContent: any;
  openModal: boolean;
  handleCloseModal: () => void;
  codeResponses: string[];
}

const CodeDetailsDialog: React.FC<CodeDetailsDialogProps> = ({
  code,
  codeContent,
  openModal,
  handleCloseModal,
  codeResponses,
}) => {
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
        <BadSmells smells={codeResponses} />
        <Button onClick={handleCloseModal} color="primary" variant="contained">
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CodeDetailsDialog;