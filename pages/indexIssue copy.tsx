import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container, Card, CardContent, CircularProgress } from '@mui/material';
import IssueDetailsDialog from './IssueDetailsDialog';

const GitHubIssue: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false); // Nuevo estado de carga

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (url.includes('github.com')) {
      setError('');
      setLoading(true); // Activar la carga

      try {
        const apiUrl = url.replace('github.com', 'api.github.com/repos') + '/issues';
        const response = await axios.get(apiUrl);
        const apiData = response.data;



        setIssues(apiData);
      } catch (error) {
        setError('Error al obtener los issues');
      }

      setLoading(false); // Desactivar la carga después de recibir los resultados
    } else {
      setError('La URL debe ser de GitHub');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  return (
  <Container maxWidth="md">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        GitHub Issues Smells
      </Typography>

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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {/* ... */}
        </Box>
      ) : issues.length > 0 ? (
        <Box mt={2}>
          {issues.map((issue: any, index: number) => (
            <Card
              key={index}
              sx={{
                width: '100%',
                mb: 2,
                borderRadius: '16px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {truncateText(issue.title, 50)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {truncateText(issue.body, 140)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', mt: 2 }}>
                  {issue.labels.map((label: any) => (
                    <Chip
                      key={label.id}
                      label={label.name}
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : null}

      {/* ... */}
    </Box>
  </Container>
);
};

export default GitHubIssue;