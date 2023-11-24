import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container, CircularProgress } from '@mui/material';
import CodeList from './codeComponents/CodeList';
import CodeDetailsDialog from './codeComponents/CodeDetailsDialog';

interface Code {
  name: string;
  url: string;
  download_url: string | null;
}

const GitHubCode: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [codes, setCodes] = useState<Code[]>([]);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para controlar la carga



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

        {loading ? ( // Mostrar el componente de carga si el estado de carga está activo
          <Box mt={2}>
            <CircularProgress />
          </Box>
        ) : codes.length > 0 ? (
          <Box mt={2}>
            <CodeList codes={codes} setSelectedCode={setSelectedCode} setOpenModal={setOpenModal} />
          </Box>
        ) : null}

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



const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (url.includes('github.com')) {
    setError('');
    setLoading(true); // Activar el estado de carga

    try {
      const apiUrl = url.replace('github.com', 'api.github.com/repos') + '/contents';
      const response = await axios.get(apiUrl);
      const apiData: Code[] = response.data;
      console.log(apiData);

      const filteredCodes: Code[] = [];

      const processItems = async (items: Code[]) => {
        for (const item of items) {
          if (
            item.download_url !== null &&
            !['.scss', '.css', '.ico', '.jpg', '.jpeg', '.svg', '.woff', '.png', '.png', '.gif'].some(extension => item.download_url!.endsWith(extension))
          ) {
            filteredCodes.push(item);
          } else if (item.download_url === null) {
            const subUrl = item.url;
            const subResponse = await axios.get(subUrl);
            const subApiData: Code[] = subResponse.data;

            await processItems(subApiData);
          }
        }
      };

      await processItems(apiData);

      setCodes(filteredCodes);
    } catch (error) {
      setError('Error al obtener los contenidos');
    } finally {
      setLoading(false); // Desactivar el estado de carga después de la petición
    }
  } else {
    setError('La URL debe ser de GitHub');
  }
};