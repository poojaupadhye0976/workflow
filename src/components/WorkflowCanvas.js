// components/WorkflowCanvas.js
import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import 'reactflow/dist/style.css';

const WorkflowCanvas = () => {
  const { nodes, edges } = useSelector((state) => state.workflow);

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', backgroundColor: '#eaeaea' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </Box>
  );
};

export default WorkflowCanvas;