// components/Sidebar.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNode } from '../redux/workflowSlice';
import { Button, TextField, Box, Typography } from '@mui/material';

const Sidebar = () => {
  const [nodeName, setNodeName] = useState('');
  const [nodeColor, setNodeColor] = useState('#000000');
  const dispatch = useDispatch();

  const handleAddNode = () => {
    if (!nodeName) return;

    const newNode = {
      id: `${Date.now()}`,
      type: 'default',
      data: { label: nodeName },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: { backgroundColor: nodeColor, color: '#fff', padding: 10 },
    };

    dispatch(addNode(newNode));
    setNodeName('');
    setNodeColor('#000000');
  };

  return (
    <Box sx={{ padding: 2, width: '300px', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        Add Node
      </Typography>
      <TextField
        fullWidth
        label="Node Name"
        variant="outlined"
        value={nodeName}
        onChange={(e) => setNodeName(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Node Color"
        type="color"
        variant="outlined"
        value={nodeColor}
        onChange={(e) => setNodeColor(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleAddNode}>
        Save Node
      </Button>
    </Box>
  );
};

export default Sidebar;
