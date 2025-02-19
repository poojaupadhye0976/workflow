import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNode } from '../redux/workflowSlice';
import { Button, TextField, Box, Typography, MenuItem } from '@mui/material';

const Sidebar = () => {
  const [nodeType, setNodeType] = useState('Start Node');
  const [nodeName, setNodeName] = useState('');
  const [nodeColor, setNodeColor] = useState('#000000');
  const dispatch = useDispatch();

  const handleAddNode = () => {
    if (!nodeName) return;

    const newNode = {
      id: `${Date.now()}`,
      type: 'customNode', // Custom node type used by React Flow
      data: { header: nodeType, label: nodeName, backgroundColor: nodeColor },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    dispatch(addNode(newNode));
    setNodeName('');
    setNodeColor('#000000');
    setNodeType('Start Node');
  };

  return (
    <Box sx={{ padding: 2, width: '300px', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        Add Node
      </Typography>
      {/* Node Type Dropdown */}
      <TextField
        fullWidth
        select
        label="Node Type"
        variant="outlined"
        value={nodeType}
        onChange={(e) => setNodeType(e.target.value)}
        margin="normal"
      >
        <MenuItem value="Start Node">Start Node</MenuItem>
        <MenuItem value="End Node">End Node</MenuItem>
        <MenuItem value="Error Node">Error Node</MenuItem>
        <MenuItem value="Text Node">Text Node</MenuItem>
        <MenuItem value="Question Node">Question Node</MenuItem>
      </TextField>
      {/* Node Name Field */}
      <TextField
        fullWidth
        label="Node Name"
        variant="outlined"
        value={nodeName}
        onChange={(e) => setNodeName(e.target.value)}
        margin="normal"
      />
      {/* Node Color Picker */}
      <TextField
        fullWidth
        label="Node Color"
        type="color"
        variant="outlined"
        value={nodeColor}
        onChange={(e) => setNodeColor(e.target.value)}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleAddNode}>
        Save Node
      </Button>
    </Box>
  );
};

export default Sidebar;
