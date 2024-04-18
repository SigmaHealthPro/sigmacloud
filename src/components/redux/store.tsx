import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import profileReducer from './reducers/profileReducer';
import InventoryReducer from './reducers/InventoryReducer';

const rootReducer = combineReducers({
  profile: profileReducer,
  inventory: InventoryReducer
});

const store = configureStore({
  reducer: rootReducer
});

export default store; // Export the store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { profile: ProfileState, inventory: InventoryState }
export type AppDispatch = typeof store.dispatch;
