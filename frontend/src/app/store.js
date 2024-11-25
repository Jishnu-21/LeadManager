import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer, // Include the user slice reducer
  },
});

export default store;
