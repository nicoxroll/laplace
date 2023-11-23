// CodeList.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Grid, Box } from '@mui/material';
import CodeDetailsDialog from './CodeDetailsDialog';

interface Code {
  id: number;
  name: string;
  download_url: string;
}

interface CodeListProps {
  codes: Code[];
  apiUrl: string;
}

const CodeList: React.FC<CodeListProps> = ({ codes, apiUrl }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  const [selectedCodeContent, setSelectedCodeContent] = useState<string>('');
  const [codeResponses, setCodeResponses] = useState<string[]>([]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCodeSubmit = async (event: React.FormEvent, code: Code) => {
    event.preventDefault();
    try {
      const startIndex = code.download_url.indexOf(".com/") + 5;
const endIndex = code.download_url.indexOf(`${code.name}`);
const repowner = code.download_url.substring(startIndex, endIndex)
console.log(repowner);
      const rawUrl = `https://raw.githubusercontent.com/${repowner}/${code.name}`;
      const response = await fetch(rawUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch raw file: ${response.status} ${response.statusText}`);
      }

      const codeContent = await response.text();

      const apiResponse = await fetch('api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issue: codeContent }),
      });

      if (!apiResponse.ok) {
        throw new Error(`API request failed: ${apiResponse.status} ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      setSelectedCodeContent(codeContent);
      setCodeResponses(prevResponses => [...prevResponses, data.result]);
      setSelectedCode(code);
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
      {selectedCode && (
        <CodeDetailsDialog
          code={selectedCode}
          codeContent={selectedCodeContent}
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          codeResponses={codeResponses}
        />
      )}
    </Grid>
  );
};

export default CodeList;