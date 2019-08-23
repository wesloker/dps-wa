import { createAction } from 'redux-actions';

const handleAPIError = createAction('HANDLE_API_ERROR');
const getPlacesDataSuccess = createAction('GET_PLACES_DATA_SUCCESS');
const getEarthquakeDataSuccess = createAction('GET_EARTHQUAKE_DATA_SUCCESS');
const getAllEarthquakeReportsSuccess = createAction(
  'GET_ALL_EARTHQUAKE_REPORTS_SUCCESS',
);
const setMapInstanceSuccess = createAction('GET_MAP_INSTANCE_SUCCESS');

const setMapInstance = (leafletMap) => (dispatch) => {
  try {
    if (typeof leafletMap === 'undefined') {
      throw new Error('Map is not available yet');
    }
    dispatch(setMapInstanceSuccess({ leafletMap }));
  } catch (err) {
    dispatch(handleAPIError(err));
  }
};

const getAllEarthquakeReports = () => async (dispatch) => {
  try {
    if (!localStorage.hasOwnProperty('earthquakeReports')) {
      const query = `
        query {
          earthquakeReports {
            num
            date
            localtime
            mag
            lat
            lng
            depth
            intensity
          }
        }
      `;
      const response = await fetch(
        'http://localhost:4000/api/v0.1.0beta/earthquake/reports',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query }),
        },
      );
      const { data: reports } = await response.json();
      if (reports === null) {
        throw new Error('Bad request.');
      }
      localStorage.setItem('earthquakeReports', JSON.stringify({ reports }));
      dispatch(getAllEarthquakeReportsSuccess(reports));
    } else {
      const data = localStorage.getItem('earthquakeReports');
      const { reports: earthquakeReports } = JSON.parse(data);
      dispatch(getAllEarthquakeReportsSuccess(earthquakeReports));
    }
  } catch (err) {
    dispatch(handleAPIError(err));
  }
};

const getEarthquakeData = (earthquakeId = 'last') => async (dispatch) => {
  try {
    if (!localStorage.hasOwnProperty('earthquakeReport')) {
      const query = `
        query {
          earthquakeReport(input: {
            dataType: "num"
            dataValue: "${376}"
          }) {
            num
            date
            localtime
            mag
            lat
            lng
            depth
            intensity
          }
        }
      `;
      const response = await fetch(
        ' http://localhost:4000/api/v0.1.0beta/earthquake/report',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query }),
        },
      );
      const { data: earthquakeReport } = await response.json();
      if (earthquakeReport === null) {
        throw new Error('Bad request. Resource Not Found');
      }
      localStorage.setItem(
        'earthquakeReport',
        JSON.stringify({ earthquakeReport }),
      );
      dispatch(getEarthquakeDataSuccess(earthquakeReport));
    } else {
      const { data: report } = JSON.parse(
        localStorage.getItem('earthquakeReport'),
      );
      dispatch(getEarthquakeDataSuccess(report));
    }
  } catch (err) {
    dispatch(handleAPIError(err));
  }
};

const getPlacesData = () => async (dispatch) => {
  try {
    if (!localStorage.hasOwnProperty('placesData')) {
      const query = `
        query {
          departments {
            _id
            code
            name
          }
        }
      `;
      const response = await fetch(
        'http://localhost:4000/api/v0.1.0beta/departments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query }),
        },
      );
      const {
        data: { departments },
      } = await response.json();
      if (departments === null) {
        throw new Error('Bad request.');
      }
      localStorage.setItem('placesData', JSON.stringify({ departments }));
      dispatch(getPlacesDataSuccess({ departments }));
    } else {
      const departments = JSON.parse(localStorage.getItem('placesData'));
      dispatch(getPlacesDataSuccess(departments));
    }
  } catch (err) {
    dispatch(handleAPIError(err));
  }
};

export {
  handleAPIError,
  setMapInstanceSuccess,
  getPlacesDataSuccess,
  getEarthquakeDataSuccess,
  getAllEarthquakeReportsSuccess,
  setMapInstance,
  getAllEarthquakeReports,
  getEarthquakeData,
  getPlacesData,
};
