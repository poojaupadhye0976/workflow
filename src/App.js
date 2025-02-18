// App.js
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import Navbar from './components/Navbar';
import WorkflowCanvas from './components/WorkflowCanvas';
import store from './redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <Navbar />
        <WorkflowCanvas />
      </div>
    </Provider>
  );
};

export default App;
