import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container, CircularProgress } from '@mui/material';
import CardCode from './CardCode';
import CodeDetailsDialog from './CodeDetailsDialog';
import { ResponsiveContainer } from 'recharts';
import PieChartComponent from '../PieChartComponent';

interface Code {
  id: number,
  name: string;
  url: string;
  download_url: string | null;
  extension: string; 
  size: number; 
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

        const response = await axios.get(`${apiUrl}`);

        const apiData: Code[] = Array.isArray(response.data) ? response.data.map((item: any) => ({
          ...item,
          extension: item.name.split('.').pop() || '',
        })) : [];

        const filteredCodes: Code[] = [];

        const processItems = async (items: Code[], parentPath = '') => {
          for (const item of items) {
            if (
              item.download_url !== null &&
              ![
                '.scss', '.css','.map', '.ico', '.jpg', '.avif', '.gitignore', '.mp4', '.mp3',
                '.ttf', '.webm', '.jpeg', '.svg', '.woff', '.eot', '.png', '.gif', '.pdf',
                '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar', '.tar',
                '.gz', '.7z', '.exe', '.dmg', '.pkg', '.iso', '.csv', '.xml', '.txt', '.rtf',
                '.log', '.bak', '.psd', '.ai', '.eps', '.tif', '.tiff', '.bmp', '.mov', '.avi',
                '.wav', '.ogg', '.flac', '.aac', '.example', '.htm', '.srt', '.sub', '.ass',
                '.vtt', '.xample'
              ]
                .some(extension => item.download_url!.endsWith(extension))
            ) {
              const filePath = parentPath ? `${parentPath}/${item.name}` : item.name;
              filteredCodes.push({ ...item, name: filePath });
            } else if (item.download_url === null) {
              const subUrl = item.url;
              const subResponse = await axios.get(subUrl);
              const subApiData: Code[] = subResponse.data.map((subItem: any) => ({
                ...subItem,
                extension: subItem.name.split('.').pop() || '',
              }));

              const subPath = parentPath ? `${parentPath}/${item.name}` : item.name;
              await processItems(subApiData, subPath);
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
        <Typography variant="h4" sx={{ mb: 2 }}>GitHub Code Scan</Typography>

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
            <CircularProgress size={100} />
          </Box>
        ) : (
          <React.Fragment>
           

            {codes.length > 0 && (
              
              <Box mt={2} width="100%">
                <PieChartComponent data={extensionData} />
                <CardCode codes={codes} />
              </Box>
            )}  
              {codes.length === 0 ? (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
    <img src="codes.png" alt="Icon" width="40%"  />
  </Box>
) : null}
            
    

            {selectedCode && (
              <Box mt={2}>
                <CodeDetailsDialog
                  code={selectedCode}
                  openModal={openModal}
                  handleCloseModal={() => setOpenModal(false)}
                  codeContent={'code'}
                />
              </Box>
            )}
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
};

export default GitHubCode;