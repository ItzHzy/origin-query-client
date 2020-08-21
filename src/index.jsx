import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/General/App';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { rootReducer } from './store'
import './assets/css/index.css'

const store = createStore(rootReducer)

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

