import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container, CircularProgress } from '@mui/material';
import CodeList from './codeComponents/CodeList';
import CodeDetailsDialog from './codeComponents/CodeDetailsDialog';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

interface Code {
  name: string;
  url: string;
  download_url: string | null;
  extension: string; // Agregar propiedad de extensión
}

const GitHubCode: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [codes, setCodes] = useState<Code[]>([]);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (url.includes('github.com')) {
      setError('');
      setLoading(true);

      try {
        const apiUrl = url.replace('github.com', 'api.github.com/repos') + '/contents';
        const response = await axios.get(apiUrl);
        const apiData: Code[] = response.data.map((item: any) => ({
          ...item,
          extension: item.name.split('.').pop() || '', // Obtener la extensión del nombre del archivo
        }));

        const filteredCodes: Code[] = [];

        const processItems = async (items: Code[]) => {
          for (const item of items) {
            if (
              item.download_url !== null &&
              !['.scss', '.css', '.ico', '.jpg', '.jpeg', '.svg', '.woff', '.eot', '.png', '.gif'].some(extension => item.download_url!.endsWith(extension))
            ) {
              filteredCodes.push(item);
            } else if (item.download_url === null) {
              const subUrl = item.url;
              const subResponse = await axios.get(subUrl);
              const subApiData: Code[] = subResponse.data.map((subItem: any) => ({
                ...subItem,
                extension: subItem.name.split('.').pop() || '',
              }));

              await processItems(subApiData);
            }
          }
        };

        await processItems(apiData);

        // Ordenar la lista de códigos por extensión
        filteredCodes.sort((a, b) => a.extension.localeCompare(b.extension));

        setCodes(filteredCodes);
      } catch (error) {
        setError('Error al obtener los contenidos');
      } finally {
        setLoading(false);
      }
    } else {
      setError('La URL debe ser de GitHub');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  
  const getExtensionData = () => {
    const extensionCounts: { [key: string]: number } = {};
    
    codes.forEach((code: Code) => {
      const { extension } = code;
      if (extension) {
        if (extensionCounts[extension]) {
          extensionCounts[extension]++;
        } else {
          extensionCounts[extension] = 1;
        }
      }
    });

    const data = Object.keys(extensionCounts).map(extension => ({
      extension,
      count: extensionCounts[extension],
    }));

    // Ordenar los datos por extensión
    data.sort((a, b) => a.extension.localeCompare(b.extension));

    return data;
  };

  const extensionData = getExtensionData();
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

        {loading ? (
          <Box mt={2}>
            <CircularProgress />
          </Box>
        ) : codes.length > 0 ? (
          <Box mt={2}>
            <CodeList codes={codes} setSelectedCode={setSelectedCode} setOpenModal={setOpenModal} />
          </Box>
        ) : null}

        {codes.length > 0 && (
          <Box mt={2} width="100%" height={300}>
            <ResponsiveContainer>
            <PieChart>
  <Pie
    data={extensionData}
    innerRadius={60} // Ajustar según tus necesidades
    outerRadius={80} // Ajustar según tus necesidades
    fill="#8884d8"
    dataKey="count"
    label={({ extension, count }) => `${extension}: ${count}`} // Modificar para mostrar la extensión seguida de la cantidad
  >
    {extensionData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
        </ResponsiveContainer>
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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000'];