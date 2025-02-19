import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#333' }}>
      <Toolbar>
        <Typography variant="h6" component="div">
          Pooja's Workflow Builder
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
