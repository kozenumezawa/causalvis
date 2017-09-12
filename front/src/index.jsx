import 'eg-renderer';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import store from './store';

import Main from './components/main.jsx';

const App = () => (
  <Main
    store={store()}
  />
);

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('app'));
