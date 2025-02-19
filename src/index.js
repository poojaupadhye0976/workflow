import './patchResizeObserver'; // Must be the first import

import React from 'react';
import ReactDOM from 'react-dom';
import { store } from './redux/store';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
