import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Main from './components/main.jsx';
import { store } from './reducer';

const App = () => (
  <Main />
);

const applicationStore = createStore(store);

ReactDOM.render((
  <BrowserRouter>
    <Provider store={applicationStore}>
      <App />
    </Provider>
  </BrowserRouter>
), document.getElementById('app'));
