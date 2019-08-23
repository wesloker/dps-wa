import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from './middlewares/logger';
import { mapReducer, earthquakeReducer, placesReducer } from './reducers/';

const reducer = combineReducers({
  mapReducer,
  placesReducer,
  earthquakeReducer,
});

const store = createStore(reducer, {}, applyMiddleware(logger, thunk));

export default store;
