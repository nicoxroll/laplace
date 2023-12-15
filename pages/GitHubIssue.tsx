import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container, CircularProgress } from '@mui/material';
import IssueDetailsDialog from './IssueDetailsDialog';
import CardIssue from './CardIssue';
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

const GitHubIssue: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (url.includes('github.com')) {
      setError('');
      setLoading(true);
  
      try {
        // Verificar si es una URL de un issue específico
        if (url.includes('/issues/')) {
          const apiUrl = url.replace('github.com', 'api.github.com/repos');
          const response = await axios.get(apiUrl);
          const apiData = [response.data];
  
          setIssues(apiData);
        } else { // Si no es una URL de un issue específico, obtener todos los issues del repositorio
          const apiUrl = url.replace('github.com', 'api.github.com/repos') + '/issues';
          const response = await axios.get(apiUrl);
          const apiData = response.data;
  
          setIssues(apiData);
        }
      } catch (error) {
        setError('Error al obtener los issues');
      }
  
      setLoading(false);
    } else {
      setError('La URL debe ser de GitHub');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.toString().length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  const handleClick = (issue: any) => {
    setSelectedIssue(issue);
    setOpenModal(true);
  };

  

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
  <Box display="flex" alignItems="center">
    GitHub Issues Smells
    <Tooltip title="Ingresa una url de repositorio o issue">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
  </Box>
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
            <CircularProgress size={100}/>
          </Box>
        ) : issues.length > 0 ? (
          <Box mt={2}>
            {issues.map((issue: any, index: number) => (
              <CardIssue
                key={index}
                issue={issue}
                truncateText={truncateText}
                handleClick={handleClick}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <img src="icon.png" alt="Icon" />
          </Box>
        )}

        {selectedIssue && (
          <Box mt={2}>
            <IssueDetailsDialog
              issue={selectedIssue}
              openModal={openModal}
              handleCloseModal={() => setOpenModal(false)}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GitHubIssue;