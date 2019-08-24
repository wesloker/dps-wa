import React from 'react';
import Page from './page';
import L from 'leaflet';
import { connect } from 'react-redux';

import { getPlacesData as getPlacesDataAction } from '../../redux/actions';
import onChangeChartFilter from '../../helpers/chart-filter';

class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: this.props.departments,
      currentValue: '',
      isDrawable: false,
      popCenters: [],
      userCoords: [],
      wayPoints: [],
    };
    this.startTableListener = this.startTableListener.bind(this);
    this.onChangeChartFilter = onChangeChartFilter.bind(this);
    this.drawAllCharts = this.drawAllCharts.bind(this);
    this.fetchPopCenters = this.fetchPopCenters.bind(this);
    this.leafletWayPoints = this.leafletWayPoints.bind(this);
    this.activateGeolocation = this.activateGeolocation.bind(this);
    this.getData = this.getData.bind(this);
  }

  async fetchPopCenters(nextId) {
    try {
      const districtsInput = document.getElementById('districtsInput');
      const districtsList = document.getElementById('districts');
      let id;
      [...districtsList.children].forEach((li) => {
        if (districtsInput.value === li.value) {
          id = li.getAttribute('data-districtId');
        }
      });
      const query = `
        query {
          popCenters (input: {
            dataType: "district_id"
            dataValue: "${id}"
          }) {
            _id
            code
            name
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
      // const token = '';
      // const authorization = 'Bearer '.concat(token);
      const fetchData = await fetch(
        `https://dps-api.herokuapp.com/api/v0.1.0beta/popcenters`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query }),
        },
      );
      const { data: popCenters } = await fetchData.json();
      this.setState({
        isDrawable: true,
        currentValue:
          this.state.currentValue !== nextId ? nextId : this.state.currentValue,
        popCenters,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async leafletWayPoints({ posLat, posLng }) {
    if (this.state.userCoords.length === 2) {
      const route = L.Routing.control({
        waypoints: [
          L.latLng(this.state.userCoords[0], this.state.userCoords[1]),
          L.latLng(posLat, posLng),
        ],
        router: new L.Routing.osrmv1({
          language: 'es',
          profile: 'car',
        }),
        //geocoder: L.Control.Geocoder.nominatim({}),
      }).addTo(this.state.leafletMap);
      console.log('agregados');
      this.setState({
        wayPoints: [route, ...this.state.wayPoints],
      });
    } else {
      let reload = true;
      await this.activateGeolocation(reload, { posLat, posLng });
    }
  }

  shouldComponentUpdate(nextProps, _nextState) {
    if (nextProps.leafletMap !== 'undefined') {
      return true;
    }
    if (nextProps.departments !== 'undefined') {
      return true;
    }
    return false;
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.leafletMap !== newProps.leafletMap) {
      this.setState({
        leafletMap: newProps.leafletMap,
      });
    }
    if (oldProps.departments !== newProps.departments) {
      this.setState({
        departments: newProps.departments,
      });
    }
  }

  async activateGeolocation(reload = false, coords) {
    if (navigator.geolocation && this.state.userCoords.length !== 2) {
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            userCoords: [position.coords.latitude, position.coords.longitude],
          });
          if (reload) {
            this.leafletWayPoints(coords);
          }
        },
        (err) => {
          console.log(err);
        },
        {
          enableHighAccuracy: true,
        },
      );
    }
  }

  startTableListener({ chartWrapper }) {
    const chartId = chartWrapper.getContainerId();
    const callback = function({ target }) {
      if (target.getAttribute('data-route') === 'goTo') {
        const arr = target.getAttribute('data-latLng');
        const coords =
          arr === null || typeof arr === 'undefined' ? [] : arr.split(',');
        if (coords.length === 2) {
          this.leafletWayPoints({ posLat: coords[0], posLng: coords[1] });
        }
      }
    };
    document
      .getElementById(chartId)
      .addEventListener('click', callback.bind(this));
  }

  drawAllCharts(e) {
    e.preventDefault();
    const nextId = document.getElementById('districtsInput').value;
    if (nextId.length > 0) {
      this.fetchPopCenters(nextId);
    }
  }

  async getData() {
    await this.props.getPlacesData();
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <Page
        tableCallback={this.startTableListener}
        popCenters={this.state.popCenters}
        isDrawable={this.state.isDrawable}
        drawAllCharts={this.drawAllCharts}
        departments={this.props.departments}
        onChangeChartFilter={this.onChangeChartFilter}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    departments: state.placesReducer.departments,
    leafletMap: state.mapReducer.leafletMap,
  };
};

const mapDispatchToProps = {
  getPlacesData: getPlacesDataAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Charts);
