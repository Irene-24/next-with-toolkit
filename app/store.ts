import { configureStore, ThunkAction, Action, combineReducers, Reducer } from '@reduxjs/toolkit';
import
{
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import counterReducer from '../features/counter/counterSlice';
import usersReducer from '../features/users/usersSlice';

//use this set up to remove things from reducer state during migrations
//autoMergeLevel2 takes care of adding fields automatically

const migrations = {
  38: ( state: any ) =>
  {
    // migration clear out device state
    return {
      ...state,
      users:
      {
        ...state.users,
        check: undefined,
        false: undefined
      }
    };
  },
};



const persistConfig = {
  key: 'root',
  version: 38,
  storage,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate( migrations, { debug: false } ),
};

const config = {
  blacklist: [ "flush/FLUSH", "rehydrate/REHYDRATE", "pause/PAUSE", "persist/PERSIST", "purge/PURGE", "register/REGISTER" ],
};


const rootReducer = combineReducers( {
  counter: counterReducer,
  users: usersReducer
}
);

const persistedReducer = persistReducer( persistConfig, rootReducer as Reducer );

export const store = configureStore( {
  reducer: persistedReducer,
  middleware: ( getDefaultMiddleware ) =>
    getDefaultMiddleware( {
      serializableCheck: {
        ignoredActions: [ FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER ],
      },
    } ).concat( createStateSyncMiddleware( config ) )

  ,
} );

initMessageListener( store );

export const persistor = persistStore( store );

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
