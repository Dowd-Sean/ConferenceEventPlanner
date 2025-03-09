// store.js
import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice';
import avReducer from './avSlice';
export default configureStore({
  reducer: {
    venue: venueReducer,
    av: avReducer,
  },
});
/*
This code creates a global Redux store using the @reduxjs/toolkit\ 
configureStore() function so all components in the application 
can access the state managed by the venueReducer().
*/