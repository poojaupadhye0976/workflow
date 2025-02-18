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
import {
  addNode,
  addEdge,
  updateNodeInput,
  updateNodePosition,
  deleteNode,
} from '../redux/workflowSlice';

// Professional Node Styles
const nodeStyles = {
  start: {
    backgroundColor: '#2E7D32', // Dark Green
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    backgroundColor: '#1565C0', // Deep Blue
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
  question: {
    backgroundColor: '#F57C00', // Vibrant Orange
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    backgroundColor: '#C62828', // Bold Red
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
  end: {
    backgroundColor: '#424242', // Dark Gray
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
};

/**
 * A helper that creates a memoized node component.
 * It uses local state for the input so that typing doesn’t trigger a Redux update
 * (and thus a full re-render) until the input loses focus.
 *
 * @param {Object} style - The inline style for the node.
 * @param {string} headerText - The header text to display.
 * @param {string} placeholder - The placeholder text for the input.
 * @param {boolean} hasTarget - If true, renders a target handle on left.
 * @param {boolean} hasSource - If true, renders a source handle on right.
 */
const createNodeComponent = (style, headerText, placeholder, hasTarget, hasSource) => {
  return React.memo(({ id, data }) => {
    const [inputValue, setInputValue] = React.useState(data.input || '');
    const dispatch = useDispatch();
    const inputRef = React.useRef(null);

    // Update local state only if input is not focused.
    React.useEffect(() => {
      if (document.activeElement !== inputRef.current) {
        setInputValue(data.input || '');
      }
    }, [data.input]);

    const handleChange = (e) => {
      setInputValue(e.target.value);
    };

    // On blur, update the Redux store so the value is saved globally.
    const handleBlur = () => {
      dispatch(updateNodeInput({ nodeId: id, value: inputValue }));
    };

    // Delete the node when the delete button is clicked.
    const handleDelete = () => {
      dispatch(deleteNode({ nodeId: id }));
    };

    return (
      <div style={style} className="node">
        <div
          className="header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{headerText}</span>
          <button
            onClick={handleDelete}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ×
          </button>
        </div>
        <div className="body">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
          />
        </div>
        {hasSource && <Handle type="source" position="right" />}
        {hasTarget && <Handle type="target" position="left" />}
      </div>
    );
  });
};

const StartNodeComponent = createNodeComponent(nodeStyles.start, 'Start Node', 'Enter text', false, true);
const TextNodeComponent = createNodeComponent(nodeStyles.text, 'Text Node', 'Enter text', true, true);
const QuestionNodeComponent = createNodeComponent(nodeStyles.question, 'Question Node', 'Enter question', true, true);
const ErrorNodeComponent = createNodeComponent(nodeStyles.error, 'Error Node', 'Enter error message', true, true);
// End Node now shows a target handle on left only.
const EndNodeComponent = createNodeComponent(nodeStyles.end, 'End Node', 'Enter text', true, false);

const WorkflowCanvas = () => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.workflow);

  // Maintain local copies for ReactFlow.
  const [nodeState, setNodes] = useState(nodes);
  const [edgeState, setEdges] = useState(edges);

  const handleConnect = (params) => {
    dispatch(addEdge(params));
  };

  // Update the node position when dragging stops.
  const onNodeDragStop = (event, node) => {
    dispatch(updateNodePosition({ nodeId: node.id, position: node.position }));
  };

  // Map node types to our custom node components.
  const nodeTypes = {
    start: StartNodeComponent,
    text: TextNodeComponent,
    question: QuestionNodeComponent,
    error: ErrorNodeComponent,
    end: EndNodeComponent,
  };

  // When a node is dropped, create a new node using the dropped type.
  const onDrop = (event) => {
    event.preventDefault();
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

  // Sync local state with Redux state.
  useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges]);

  // Suppress any ResizeObserver warnings (often seen with ReactFlow).
  useEffect(() => {
    if (typeof ResizeObserver !== 'undefined') {
      const original = ResizeObserver.prototype.observe;
      ResizeObserver.prototype.observe = function () {
        try {
          original.apply(this, arguments);
        } catch (e) {
          console.warn(e);
        }
      };
    }
  }, []);

  return (
    <div className="workflow-container" style={{ display: 'flex' }}>
      {/* Sidebar for dragging nodes */}
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
          onNodeDragStop={onNodeDragStop}
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
