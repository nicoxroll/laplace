import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Grid, Box, Chip } from '@mui/material';

interface Issue {
  id: number;
  title: string;
  body: string;
}

interface IssueListProps {
  issues: Issue[];
  setSelectedIssue: (issue: Issue) => void;
  setOpenModal: (value: boolean) => void;
  apiUrl: '/api/generate';
}

const BadSmell: React.FC<{ smell: string }> = ({ smell }) => {
  return <Chip label={smell} color="secondary" />;
};

const IssueList: React.FC<IssueListProps> = ({ issues, setSelectedIssue, setOpenModal, apiUrl }) => {
  const [selectedIssueDetails, setSelectedIssueDetails] = useState<any>(null);
  const [issueResponses, setIssueResponses] = useState<string[]>([]);

  
  
  const handleIssueSubmit = async (event: React.FormEvent, issue: Issue) => {
    event.preventDefault();
    try {
      const response = await fetch('api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issue: issue.body }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setSelectedIssue(issue);
      setIssueResponses(prevResponses => [...prevResponses, data.result]);
      setOpenModal(true);
    } catch (error) {
      console.error('Error al obtener los detalles del problema:', error);
      
    }
  };

  return (
    <Grid container spacing={2}>
      {issues.map((issue) => (
        <Grid item xs={12} key={issue.id}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.2)', backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {issue.title}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {issue.body}
                </Typography>
              </CardContent>
              <CardActions>
                <form onSubmit={(event) => handleIssueSubmit(event, issue)}>
                  <Button size="small" color="primary" id="issue" type="submit">
                    Ver detalles
                  </Button>
                </form>
              </CardActions>
               
            </Card>
          </Box>
        </Grid>
      ))}

      {issueResponses.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>Respuestas:</Typography>
          <ul>
            {issueResponses.map((response, index) => (
              <li key={index}>{response}</li>
            ))}
          </ul>
        </Grid>
      )}
    </Grid>
  );
};

export default IssueList;