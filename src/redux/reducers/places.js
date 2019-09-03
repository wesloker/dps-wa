import { handleActions } from 'redux-actions';
import {
  getPlacesDataSuccess,
  getProvincesDataSuccess,
  getDistrictsDataSuccess,
  getPopCentersDataSuccess,
  getDepartmentsDataSuccess,
} from '../actions';

const defaultState = {
  departments: [],
  provinces: [],
  districts: [],
  popCenters: [],
};

const reducer = handleActions(
  {
    [getPopCentersDataSuccess]: (state, action) => {
      /* const { departments } = state;
      departments.forEach((department) => {
        department.provinces.forEach((province) => {
          if (province.hasOwnProperty('districts')) {
            province.districts.forEach((district) => {
              if (district._id === action.payload.districtId) {
                district.popCenters = [...action.payload.popCenters];
              }
            });
          }
        }); */
      const { popCenters } = state;
      popCenters.push(...action.payload.popCenters);
      return { ...state, popCenters };
    },
    [getDistrictsDataSuccess]: (state, action) => {
      /* const { departments } = state;
      departments.forEach((department) => {
        department.provinces.forEach((province) => {
          if (province._id === action.payload.provinceId) {
            province.districts = [...action.payload.districts];
          }
        });
      });
      return { ...state, departments }; */
      const { districts } = state;
      districts.push(...action.payload.districts);
      return { ...state, districts };
    },
    [getProvincesDataSuccess]: (state, action) => {
      /* const { departments } = state;
      departments.forEach((department) => {
        if (department._id === action.payload.departmentId) {
          department.provinces = [...action.payload.provinces];
        }
      });
      return { ...state, departments }; */
      const { provinces } = state;
      provinces.push(...action.payload.provinces);
      return { ...state, provinces };
    },
    [getDepartmentsDataSuccess]: (state, action) => {
      /* const { departments } = state;
      departments.push(...action.payload);
      return { ...state, departments }; */
      const { departments } = state;
      departments.push(...action.payload);
      return { ...state, departments };
    },
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
