// store.js
import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice';

export default configureStore({
  reducer: {
    venue: venueReducer,
  },
});
/*
This code creates a global Redux store using the @reduxjs/toolkit\ 
configureStore() function so all components in the application 
can access the state managed by the venueReducer().
*/