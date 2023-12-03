import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  id: number,
  name: string,
  role: string,
  description: string,
  key: string,
) {
  return { id, name, role, description, key };
}

const rows = [
  createData(1, 'Agent 1', 'Admin', 'Lorem ipsum dolor sit amet', '123456'),
  createData(2, 'Agent 2', 'User', 'Consectetur adipiscing elit', '987654'),
  createData(3, 'Agent 3', 'Guest', 'Sed do eiusmod tempor incididunt', 'abcdef'),
];

export default function AccessibleTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="caption table">
        <caption>A basic table example with a caption</caption>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Clave</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.key}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}