import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, CardActionArea } from '@mui/material';

interface CardIssueProps {
  issue: any;
  truncateText: (text: string, maxLength: number) => string;
  handleClick: (issue: any) => void;
}
const CardIssue: React.FC<CardIssueProps> = ({ issue, truncateText, handleClick }) => {
  if (!issue || !issue.title) {
    return null; // 
  }

  const { title, body, labels } = issue;

  return (
    <Card sx={{ width: '100%', mb: 2 }}>
      <CardActionArea>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            {truncateText(title, 50)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {typeof body === 'string' ? truncateText(body, 140) : ''}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
            {labels && labels.map((label: any, labelIndex: number) => (
              <Chip
                key={labelIndex}
                label={label.name}
                color="primary"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => handleClick(issue)}
          >
            Ver detalles
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardIssue;