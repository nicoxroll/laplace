import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import IssueList from './IssueList';
import IssueDetailsDialog from './IssueDetailsDialog';

const GitHubIssue: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (url.includes('github.com')) {
      setError('');

      try {
        const apiUrl = url.replace('github.com', 'api.github.com/repos') + '/issues';
        const response = await axios.get(apiUrl);
        const apiData = response.data;

        setIssues(apiData);
      } catch (error) {
        setError('Error al obtener los issues');
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
        <Typography variant="h4" sx={{ mb: 2 }}>GitHub Issues Smells</Typography>

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

        {issues.length > 0 && (
          <Box mt={2}>
            <IssueList issues={issues} setSelectedIssue={setSelectedIssue} setOpenModal={setOpenModal} />
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