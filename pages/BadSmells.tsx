import React from 'react';
import { Chip } from '@mui/material';

interface BadSmellsProps {
  smells: string[];
}

const BadSmells: React.FC<BadSmellsProps> = ({ smells }) => {
  return (
    <div>
      {smells.map((smell, index) => (
        <Chip key={index} label={smell} color="primary" />
      ))}
    </div>
  );
};

export default BadSmells;