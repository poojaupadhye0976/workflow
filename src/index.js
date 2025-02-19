import React from 'react';
import ReactDOM from 'react-dom';
import { store } from './redux/store'; // ✅ Use named import
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
