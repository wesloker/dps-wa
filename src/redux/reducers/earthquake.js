import { handleActions } from 'redux-actions';
import {
  getEarthquakeDataSuccess,
  getAllEarthquakeReportsSuccess,
} from '../actions';

const defaultState = {
  earthquakeReport: {
    num: 0,
    date: '00/00/00',
    localtime: '00:00:00',
    mag: '-',
    ref: '-',
    lat: '-',
    lng: '-',
    depth: 0,
    intensity: '-',
  },
  earthquakeReports: [],
};

const reducer = handleActions(
  {
    [getEarthquakeDataSuccess]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    [getAllEarthquakeReportsSuccess]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  defaultState,
);

export default reducer;
