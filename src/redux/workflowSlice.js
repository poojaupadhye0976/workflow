// src/redux/workflowSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [],
  edges: [],
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    addNode: (state, action) => {
      state.nodes.push(action.payload);
    },
    addEdge: (state, action) => {
      state.edges.push(action.payload);
    },
    // Action to update the position of a node
    setNodePosition: (state, action) => {
      const { nodeId, position } = action.payload;
      const node = state.nodes.find((n) => n.id === nodeId);
      if (node) {
        node.position = position;
      }
    },
  },
});

export const { addNode, addEdge, setNodePosition } = workflowSlice.actions;

export default workflowSlice.reducer;
