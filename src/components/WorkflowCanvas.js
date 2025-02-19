import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  applyNodeChanges,
} from 'reactflow';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import 'reactflow/dist/style.css';
import { setNodes, addEdge } from '../redux/workflowSlice';

// Custom node component that renders a header and label with connection handles.
const CustomNode = ({ data, selected }) => {
  return (
    <Box
      sx={{
        border: selected ? '2px solid #555' : '1px solid #999',
        borderRadius: 1,
        backgroundColor: data.backgroundColor || '#1976d2',
        padding: 1,
        minWidth: 150,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <Box sx={{ padding: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.header}
        </Typography>
        <Typography variant="body2">{data.label}</Typography>
      </Box>
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
    </Box>
  );
};

const WorkflowCanvas = () => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.workflow);

  // Memoize nodeTypes so that the same object reference is used on every render.
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  // Use React Flow's applyNodeChanges to process node updates.
  const onNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      dispatch(setNodes(updatedNodes));
    },
    [nodes, dispatch]
  );

  // Add an edge when a connection is made.
  const onConnect = useCallback(
    (connection) => {
      dispatch(addEdge(connection));
    },
    [dispatch]
  );

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', backgroundColor: '#eaeaea' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </Box>
  );
};

export default WorkflowCanvas;
