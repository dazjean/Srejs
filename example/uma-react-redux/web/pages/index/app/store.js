import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';


export const  createStore = (Props)=>{
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
    preloadedState:{counter:Props.counter}
  })
}
