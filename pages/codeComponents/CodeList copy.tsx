import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Grid, Box, Chip } from '@mui/material';

interface Code {
  id: number;
  name: string;
}

interface CodeListProps {
  
  codes: Code[];
  setSelectedCode: (code: Code) => void;
  setOpenModal: (value: boolean) => void;
  apiUrl: string;
}

const CodeList: React.FC<CodeListProps> = ({ codes, setSelectedCode, setOpenModal, apiUrl }) => {
  const [selectedCodeDetails, setSelectedCodeDetails] = useState<any>(null);
  const [codeResponses, setCodeResponses] = useState<string[]>([]);

  const handleCodeSubmit = async (event: React.FormEvent, code: Code) => {
    event.preventDefault();
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.name }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setSelectedCode(code);
      setCodeResponses(prevResponses => [...prevResponses, data.result]);
      setOpenModal(true);
    } catch (error) {
      console.error('Error al obtener los detalles del problema:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      {codes.map((code) => (
        <Grid item xs={12} key={code.id}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.2)', backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {code.name}
                </Typography>
              </CardContent>
              <CardActions>
                <form onSubmit={(event) => handleCodeSubmit(event, code)}>
                  <Button size="small" color="primary" id="code" type="submit">
                    Ver detalles
                  </Button>
                </form>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default CodeList;