import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, CardActionArea } from '@mui/material';
import { InsertDriveFile, Code } from '@mui/icons-material';
import CodeDetailsDialog from './CodeDetailsDialog';

interface Code {
  id: number;
  name: string;
  download_url: string;
  size: number; // Agregar propiedad de tamaño
}

interface CardCodeProps {
  codes: Code[];
  apiUrl: string;
}

const CardCode: React.FC<CardCodeProps> = ({ codes, apiUrl }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  const [selectedCodeContent, setSelectedCodeContent] = useState<string>('');
  const [codeResponses, setCodeResponses] = useState<string[]>([]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCodeClick = async (code: Code) => {
    try {
      const startIndex = code.download_url.indexOf(".com/") + 5;
      const endIndex = code.download_url.indexOf(`${code.name}`);
      const repowner = code.download_url.substring(startIndex, endIndex);
      console.log(repowner);
      const rawUrl = `https://raw.githubusercontent.com/${repowner}/${code.name}`;
      const response = await fetch(rawUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch raw file: ${response.status} ${response.statusText}`);
      }

      const codeContent = await response.text();

      setSelectedCodeContent(codeContent);
      setSelectedCode(code);
      setOpenModal(true);
    } catch (error) {
      console.error('Error al obtener los detalles del problema:', error);
    }
  };

  const formatSize = (size: number) => {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1024 * 1024) {
      const kbSize = (size / 1024).toFixed(2);
      return kbSize + ' KB';
    } else {
      const mbSize = (size / (1024 * 1024)).toFixed(2);
      return mbSize + ' MB';
    }
  };

  const getIconByExtension = (name: string) => {
    if (
      name.includes('package') ||
      name.includes('requirements') ||
      name.includes('pom.xml') ||
      name.includes('composer')
    ) {
      return <InsertDriveFile />;
    } else {
      return <Code />;
    }
  };

  return (
    <Grid container spacing={2}>
      {codes.map((code) => (
        <Grid item xs={12} sm={6} md={4} key={code.id}>
          <Card
            sx={{ height: '100%', cursor: 'pointer' }}
            onClick={() => handleCodeClick(code)}
          >
            <CardActionArea>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {code.name}
              </Typography>
              {getIconByExtension(code.name || '')}
              <Typography variant="body2" color="text.secondary">
                Size: {formatSize(code.size)}
              </Typography>
            </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
      {selectedCode && (
        <CodeDetailsDialog
          code={selectedCode}
          codeContent={selectedCodeContent}
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          codeResponses={codeResponses}
        />
      )}
    </Grid>
  );
};

export default CardCode;