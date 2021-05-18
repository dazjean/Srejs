import React from 'react';
import './index.css';
import App from './App';
import { createStore } from './app/store';
import { Provider } from 'react-redux';

export default (Props)=>{
  return (
    <React.StrictMode>
    <Provider store={createStore(Props)}>
      <App />
    </Provider>
  </React.StrictMode>
  )
}
