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
}

const BadSmell: React.FC<{ smell: string }> = ({ smell }) => {
  return <Chip label={smell} color="secondary" />;
};

const IssueList: React.FC<IssueListProps> = ({ issues, setSelectedIssue, setOpenModal }) => {
  
  
  
  const handleIssueSubmit = async (event: React.FormEvent, issue: Issue) => {
    event.preventDefault();
    setSelectedIssue(issue);
    setOpenModal(true);
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
    </Grid>
  );
};

export default IssueList;