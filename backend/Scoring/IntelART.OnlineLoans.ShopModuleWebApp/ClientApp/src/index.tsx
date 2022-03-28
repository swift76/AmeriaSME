import './scss/index.scss';

import App from './app/App';
import React from 'react';
import ReactDOM from 'react-dom';

const render = () => {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
};

window.onload = () => {
  render();
};
