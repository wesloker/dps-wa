import { handleActions } from 'redux-actions';
import { setMapInstanceSuccess } from '../actions';

const defaultState = {
  leafletMap: 'Map is not available yet',
};

const reducer = handleActions(
  {
    [setMapInstanceSuccess]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  defaultState,
);

export default reducer;
