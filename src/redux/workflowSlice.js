// workflowSlice.js
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
    updateNodeInput: (state, action) => {
      const { nodeId, value } = action.payload;
      const node = state.nodes.find((node) => node.id === nodeId);
      if (node) {
        node.data.input = value;
      }
    },
    updateNodePosition: (state, action) => {
      const { nodeId, position } = action.payload;
      const node = state.nodes.find((node) => node.id === nodeId);
      if (node) {
        node.position = position;
      }
    },
    deleteNode: (state, action) => {
      const { nodeId } = action.payload;
      // Remove the node.
      state.nodes = state.nodes.filter((node) => node.id !== nodeId);
      // Also remove edges that are connected to the deleted node.
      state.edges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
    },
  },
});

export const {
  addNode,
  addEdge,
  updateNodeInput,
  updateNodePosition,
  deleteNode,
} = workflowSlice.actions;
export default workflowSlice.reducer;
