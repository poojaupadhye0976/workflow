import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Sidebar from './components/Sidebar';
import WorkflowCanvas from './components/WorkflowCanvas';
import { Box } from '@mui/material';

const App = () => {
  return (
    <Provider store={store}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <WorkflowCanvas />
      </Box>
    </Provider>
  );
};

export default App;
