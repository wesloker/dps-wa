import { handleActions } from 'redux-actions';
import { getPlacesDataSuccess } from '../actions';

const defaultState = {
  departments: [],
};

const reducer = handleActions(
  {
    [getPlacesDataSuccess]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  defaultState,
);

export default reducer;
