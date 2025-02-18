// WorkflowCanvas.js
import React, { useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { addNode, addEdge } from '../redux/workflowSlice';

// Node Styles
const nodeStyles = {
  start: {
    backgroundColor: '#34D399',
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    backgroundColor: '#A78BFA',
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
  question: {
    backgroundColor: '#FBBF24',
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    backgroundColor: '#F87171',
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
  end: {
    backgroundColor: '#6B7280',
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
};

// Debounce function for input change
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const WorkflowCanvas = () => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.workflow);

  const [nodeState, setNodes] = useState(nodes);
  const [edgeState, setEdges] = useState(edges);

  const handleConnect = (params) => {
    dispatch(addEdge(params));
  };

  // Handle input change with debounce
  const handleInputChange = debounce((nodeId, value) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, input: value } } : node
      )
    );
  }, 300); // Debounce delay of 300ms

  const nodeTypes = {
    start: (props) => (
      <div style={nodeStyles.start} className="node">
        <div className="header">Start Node</div>
        <div className="body">
          <input
            type="text"
            value={props.data.input || ''}
            onChange={(e) => handleInputChange(props.id, e.target.value)}
            placeholder="Enter text"
          />
        </div>
        <Handle type="source" position="right" />
      </div>
    ),
    text: (props) => (
      <div style={nodeStyles.text} className="node">
        <div className="header">Text Node</div>
        <div className="body">
          <input
            type="text"
            value={props.data.input || ''}
            onChange={(e) => handleInputChange(props.id, e.target.value)}
            placeholder="Enter text"
          />
        </div>
        <Handle type="source" position="right" />
        <Handle type="target" position="left" />
      </div>
    ),
    question: (props) => (
      <div style={nodeStyles.question} className="node">
        <div className="header">Question Node</div>
        <div className="body">
          <input
            type="text"
            value={props.data.input || ''}
            onChange={(e) => handleInputChange(props.id, e.target.value)}
            placeholder="Enter question"
          />
        </div>
        <Handle type="source" position="right" />
        <Handle type="target" position="left" />
      </div>
    ),
    error: (props) => (
      <div style={nodeStyles.error} className="node">
        <div className="header">Error Node</div>
        <div className="body">
          <input
            type="text"
            value={props.data.input || ''}
            onChange={(e) => handleInputChange(props.id, e.target.value)}
            placeholder="Enter error message"
          />
        </div>
        <Handle type="source" position="right" />
        <Handle type="target" position="left" />
      </div>
    ),
    end: (props) => (
      <div style={nodeStyles.end} className="node">
        <div className="header">End Node</div>
        <div className="body">
          <input
            type="text"
            value={props.data.input || ''}
            onChange={(e) => handleInputChange(props.id, e.target.value)}
            placeholder="Enter text"
          />
        </div>
        <Handle type="source" position="right" />
      </div>
    ),
  };

  // Handling the drag-and-drop functionality:
  const onDrop = (event) => {
    const type = event.dataTransfer.getData('type');
    const newNode = {
      id: `${nodes.length + 1}`,
      type,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        input: '',
      },
      position: { x: event.clientX - 100, y: event.clientY - 100 },
    };
    dispatch(addNode(newNode));
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges]);

  // Suppress ResizeObserver warning
  useEffect(() => {
    if (typeof ResizeObserver !== "undefined") {
      const original = ResizeObserver.prototype.observe;
      ResizeObserver.prototype.observe = function () {
        try {
          original.apply(this, arguments);
        } catch (e) {
          console.warn(e); // Log the error but don't throw it
        }
      };
    }
  }, []);

  return (
    <div className="workflow-container" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          width: '200px',
          backgroundColor: '#f3f4f6',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3>Drag Nodes</h3>
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('type', 'start')}
          style={nodeStyles.start}
        >
          Start Node
        </div>
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('type', 'end')}
          style={nodeStyles.end}
        >
          End Node
        </div>
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('type', 'text')}
          style={nodeStyles.text}
        >
          Text Node
        </div>
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('type', 'question')}
          style={nodeStyles.question}
        >
          Question Node
        </div>
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('type', 'error')}
          style={nodeStyles.error}
        >
          Error Node
        </div>
      </div>

      {/* Workflow Canvas */}
      <div
        className="workflow-canvas"
        style={{ flexGrow: 1, position: 'relative', height: '600px' }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodeState}
          edges={edgeState}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          style={{ width: '100%', height: '100%' }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default WorkflowCanvas;
