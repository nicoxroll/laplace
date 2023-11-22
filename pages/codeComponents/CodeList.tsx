import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Grid, Box, Chip } from '@mui/material';

interface Code {
  id: number;
  name: string;
}

interface CodeListProps {
  
  codes: Code[];
  
  setSelectedCode: (code: Code) => void;
  setSelectedCodeRaw: (codeComponents: any) => void;
  setOpenModal: (value: boolean) => void;
  apiUrl: string;
}

const CodeList: React.FC<CodeListProps> = ({ codes, setSelectedCode, setSelectedCodeRaw, setOpenModal, apiUrl }) => {
  const [selectedCodeDetails, setSelectedCodeDetails] = useState<any>(null);
  const [codeResponses, setCodeResponses] = useState<string[]>([]);

  const handleCodeSubmit = async (event: React.FormEvent, code: Code) => {
    event.preventDefault();
    try {
      const rawUrl = `https://raw.githubusercontent.com/nicoxroll/coffe/master/${code.name}`;
      const response = await fetch(rawUrl);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch raw file: ${response.status} ${response.statusText}`);
      }
  
      const codeContent = await response.text();
  
      const apiUrl = '/api/generate'; // Reemplaza esto con tu URL de API real
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issue: codeContent }),
      });
  
      if (!apiResponse.ok) {
        throw new Error(`API request failed: ${apiResponse.status} ${apiResponse.statusText}`);
      }
      console.log(codeContent);
      const data = await apiResponse.json();
      setSelectedCode(code);
      setSelectedCodeRaw(codeContent);
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