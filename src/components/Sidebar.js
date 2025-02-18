import React from 'react';

const Sidebar = ({ handleAddNode }) => {
  return (
    <div className="sidebar">
      <button onClick={() => handleAddNode('start', 'Start Node')}>Start Node</button>
      <button onClick={() => handleAddNode('end', 'End Node')}>End Node</button>
      <button onClick={() => handleAddNode('text', 'Text Node')}>Text Node</button>
      <button onClick={() => handleAddNode('question', 'Question Node')}>Question Node</button>
    </div>
  );
};

export default Sidebar;
