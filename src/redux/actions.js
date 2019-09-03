import { createAction } from 'redux-actions';

const handleAPIError = createAction('HANDLE_API_ERROR');
const getPlacesDataSuccess = createAction('GET_PLACES_DATA_SUCCESS');
const getEarthquakeDataSuccess = createAction('GET_EARTHQUAKE_DATA_SUCCESS');
const getAllEarthquakeReportsSuccess = createAction(
  'GET_ALL_EARTHQUAKE_REPORTS_SUCCESS',
);
const setMapInstanceSuccess = createAction('GET_MAP_INSTANCE_SUCCESS');

const getDepartmentsDataSuccess = createAction('GET_DEPARTMENTS_DATA_SUCCESS');
const getProvincesDataSuccess = createAction('GET_PROVINCES_DATA_SUCCESS');
const getDistrictsDataSuccess = createAction('GET_DISTRICTS_DATA_SUCCESS');
const getPopCentersDataSuccess = createAction('GET_POP_CENTERS_DATA_SUCCESS');

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
        `${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000'
            : 'https://spd-api.herokuapp.com'
        }/api/v0.1.0beta/earthquake/reports`,
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

const getPlacesDataFunc = (
  { target } = { target: { name: 'init', value: '' } },
) => async (dispatch) => {
  try {
    if (
      target.name === null ||
      typeof target.name === 'undefined' ||
      typeof target.name === 'number' ||
      typeof target.name === 'object' ||
      typeof target.name === 'function'
    ) {
      throw new Error(
        `Unexpected value. PLACENAME must be a string but got: `,
        target.name,
      );
    } else if (
      target.value === null ||
      typeof target.value === 'undefined' ||
      typeof target.value === 'number' ||
      typeof target.value === 'object' ||
      typeof target.value === 'function'
    ) {
      throw new Error(
        `Unexpected value. PLACETYPE must be a string but got: `,
        target.value,
      );
    } else if (target.name === 'init') {
      const departmentsInput = document.getElementById('departmentsInput');
      const departmentsList = document.getElementById('departments');
      const query = `
        query {
          departments {
            _id
            name
          }
        }
      `;
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000'
            : 'https://spd-api.herokuapp.com'
        }/api/v0.1.0beta/departments`,
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
      departmentsInput.removeAttribute('readonly');
      Object.values(departments).forEach((department) => {
        const optionTag = document.createElement('option');
        optionTag.setAttribute('data-departmentId', department._id);
        optionTag.value = department.name;
        departmentsList.appendChild(optionTag);
      });
      dispatch(getDepartmentsDataSuccess(departments));
    } else if (target.name === 'departments') {
      const provincesInput = document.getElementById('provincesInput');
      const provincesList = document.getElementById('provinces');
      const districtsInput = document.getElementById('districtsInput');
      const districtsList = document.getElementById('districts');
      provincesInput.value = '';
      provincesInput.setAttribute('readonly', true);
      provincesList.innerHTML = '';
      districtsInput.value = '';
      districtsInput.setAttribute('readonly', true);
      districtsList.innerHTML = '';

      const departmentsList = document.getElementById(target.name).children;
      const { id: departmentId } = [...departmentsList]
        .map((department) => {
          return {
            id: department.getAttribute('data-departmentId'),
            value: department.value,
          };
        })
        .find((place) => {
          if (place.value === target.value) {
            return place;
          }
        });
      const query = `
        query {
          provinces (input: {
            dataType: "department_id"
            dataValue: "${departmentId}"
          }) {
            _id
            name
            department_id
          }
        }
      `;
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000'
            : 'https://spd-api.herokuapp.com'
        }/api/v0.1.0beta/provinces`,
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
        data: { provinces },
      } = await response.json();
      provincesInput.removeAttribute('readonly');
      Object.values(provinces).forEach((province) => {
        const optionTag = document.createElement('option');
        optionTag.setAttribute('data-provinceId', province._id);
        optionTag.value = province.name;
        provincesList.appendChild(optionTag);
      });
      dispatch(getProvincesDataSuccess({ departmentId, provinces }));
    } else if (target.name === 'provinces') {
      const districtsInput = document.getElementById('districtsInput');
      const districtsList = document.getElementById('districts');
      districtsInput.value = '';
      districtsInput.setAttribute('readonly', true);
      districtsList.innerHTML = '';
      const provincesList = document.getElementById(target.name).children;
      const { id: provinceId } = [...provincesList]
        .map((province) => {
          return {
            id: province.getAttribute('data-provinceId'),
            value: province.value,
          };
        })
        .find((place) => {
          if (place.value === target.value) {
            return place;
          }
        });
      const query = `
        query {
          districts (input: {
            dataType: "province_id"
            dataValue: "${provinceId}"
          }) {
            _id
            name
            province_id
          }
        }
      `;
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000'
            : 'https://spd-api.herokuapp.com'
        }/api/v0.1.0beta/districts`,
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
        data: { districts },
      } = await response.json();
      districtsInput.removeAttribute('readonly');
      Object.values(districts).forEach((district) => {
        const optionTag = document.createElement('option');
        optionTag.setAttribute('data-districtId', district._id);
        optionTag.value = district.name;
        districtsList.appendChild(optionTag);
      });
      dispatch(getDistrictsDataSuccess({ provinceId, districts }));
    } else if (target.name === 'popCenters') {
      const districtsList = document.getElementById('districts').children;
      const { id: districtId } = [...districtsList]
        .map((district) => {
          return {
            id: district.getAttribute('data-districtId'),
            value: district.value,
          };
        })
        .find((place) => {
          if (place.value === target.value) {
            return place;
          }
        });
      const query = `
        query {
          popCenters (input: {
            dataType: "district_id"
            dataValue: "${districtId}"
          }) {
            _id
            name
            district_id
            population {
              total
              male
              female
            }
            houses {
              total
              occupied
              unoccupied
            }
          }
        }
      `;
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000'
            : 'https://spd-api.herokuapp.com'
        }/api/v0.1.0beta/popcenters`,
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
        data: { popCenters },
      } = await response.json();
      dispatch(getPopCentersDataSuccess({ districtId, popCenters }));
    } else {
      throw new Error(
        `Unexpected value. PLACETYPE must be (department | province | district | popCenter) but got: `,
        target.name,
      );
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
        `${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000'
            : 'https://spd-api.herokuapp.com'
        }/api/v0.1.0beta/earthquake/report`,
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
        `${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000'
            : 'https://spd-api.herokuapp.com'
        }/api/v0.1.0beta/departments`,
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
  getPlacesDataFunc,
  getDepartmentsDataSuccess,
  getProvincesDataSuccess,
  getDistrictsDataSuccess,
  getPopCentersDataSuccess,
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
