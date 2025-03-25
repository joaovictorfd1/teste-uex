import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import GoogleMapComponent from '../Maps';

export const Header = ({ title, isAdd, isMap, handleOpenDialog, onSearch, location }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: `${isAdd ? 'row' : 'column'}`, width: '100%', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: '10px' }}>
      <Typography variant="h5" color="textPrimary">{title}</Typography>
      {isAdd && (
        <>
          <TextField 
            variant="outlined" 
            placeholder="Buscar..." 
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Adicionar
          </Button>
        </>
      )}
      {isMap && <GoogleMapComponent location={location} />}
    </div>
  );
};

export default Header;
