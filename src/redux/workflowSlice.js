// redux/workflowSlice.js
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
    updateNodePosition: (state, action) => {
      const { nodeId, position } = action.payload;
      state.nodes = state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      );
    },
    deleteNode: (state, action) => {
      const { nodeId } = action.payload;
      state.nodes = state.nodes.filter((node) => node.id !== nodeId);
      state.edges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
    },
  },
});

export const { addNode, addEdge, updateNodePosition, deleteNode } = workflowSlice.actions;
export default workflowSlice.reducer;
