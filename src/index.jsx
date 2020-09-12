import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { store } from './reducers/store'
import App from './components/General/App';
import './assets/css/styles.css'

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

