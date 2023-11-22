import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import CodeList from './codeComponents/CodeList';
import CodeDetailsDialog from './codeComponents/CodeDetailsDialog';

interface Code {
  name: string;
  download_url: string | null;
}

const GitHubCode: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [codes, setCodes] = useState<Code[]>([]);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (url.includes('github.com')) {
      setError('');

      try {
        const apiUrl = url.replace('github.com', 'api.github.com/repos') + '/contents';
        const response = await axios.get(apiUrl);
        const apiData: Code[] = response.data;
        console.log(apiData);

        // Filtrar los elementos con download_url en null
        const filteredCodes = apiData.filter((code) => code.download_url !== null);

        setCodes(filteredCodes);
      } catch (error) {
        setError('Error al obtener los contenidos');
      }
    } else {
      setError('La URL debe ser de GitHub');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>GitHub Code Smells</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="URL de GitHub"
            variant="outlined"
            fullWidth
            value={url}
            onChange={handleChange}
            error={Boolean(error)}
            helperText={error}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Obtener datos
          </Button>
        </form>

        {codes.length > 0 && (
          <Box mt={2}>
            <CodeList codes={codes} setSelectedCode={setSelectedCode} setOpenModal={setOpenModal} />
          </Box>
        )}

        {selectedCode && (
          <Box mt={2}>
            <CodeDetailsDialog
              code={selectedCode}
              openModal={openModal}
              handleCloseModal={() => setOpenModal(false)}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GitHubCode;