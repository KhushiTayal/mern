import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './types'; // Import your Redux store
import App from './App'; // Import your main App component

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
