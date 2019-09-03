import React from 'react';
import L from 'leaflet';
import { connect } from 'react-redux';

import {
  getPlacesData as getPlacesDataAction,
  getPlacesDataFunc as getPlacesDataFuncAction,
} from '../../redux/actions';
import onChangeChartFilter from '../../helpers/chart-filter';
import TableChartConstructor from '../../helpers/table';
import textToSpeech from '../../helpers/textToSpeech';
import Page from './page';

class Charts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // departments: this.props.departments,
      currentValue: '',
      isDrawable: false,
      popCenters: [],
      userCoords: [],
      wayPoints: [],
      drawTable: false,
      leafletMap: {},
    };
    this.startTableListener = this.startTableListener.bind(this);
    this.onChangeChartFilter = onChangeChartFilter.bind(this);
    this.drawAllCharts = this.drawAllCharts.bind(this);
    // this.fetchPopCenters = this.fetchPopCenters.bind(this);
    this.leafletWayPoints = this.leafletWayPoints.bind(this);
    this.activateGeolocation = this.activateGeolocation.bind(this);
    // this.getData = this.getData.bind(this);
    this.drawTableChart = this.drawTableChart.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.popCenters.length > 0 ||
      typeof props.leafletMap === typeof state.leafletMap
    ) {
      console.log('props get derived', props);
      return {
        popCenters: props.popCenters,
        leafletMap: props.leafletMap,
      };
    }
    return null;
  }

  drawTableChart(id) {
    if (this.state.isDrawable && !this.state.drawTable) {
      const table = new TableChartConstructor(id, {
        allowHTML: false,
        styles: {
          width: 500,
        },
      });
      let arr = [];
      this.state.popCenters.popCenters.forEach((el) => {
        arr.push([
          el.name,
          el.population.total,
          el.population.male,
          el.population.female,
          Boolean(Math.round(Math.random())),
          `<span data-route='goTo' data-latLng='-12.046374, -77.042793' style='cursor: pointer;'>Ir</span>`,
        ]);
      });
      table
        .addColumns([
          { value: 'Centro Poblado', type: 'string' },
          { value: 'Población Total', type: 'number' },
          { value: 'Hombres', type: 'number' },
          { value: 'Mujeres', type: 'number' },
          { value: 'Zona Segura', type: 'boolean' },
          { value: 'Rutas', type: 'string' },
        ])
        .addRows(arr);

      table.draw();

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
        .getElementById(id)
        .addEventListener('click', callback.bind(this));
      /* this.setState({
        drawTable: !this.state.drawTable,
      }); */
    }
  }
  /* 
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
  } */

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
      /* this.setState({
        wayPoints: [route, ...this.state.wayPoints],
      }); */
    } else {
      let reload = true;
      await this.activateGeolocation(reload, { posLat, posLng });
    }
  }

  /* ELIMINAR LA FUNCION DE ABAJO YA QUE ACTUALIZA INNECESARIAMENTE EL COMPONENTE */
  /*  shouldComponentUpdate(nextProps, _nextState) {
    console.log('current: ', this.props);
    console.log('new: ', nextProps);
    if (
      typeof nextProps.leafletMap === 'object' ||
      nextProps.popCenters.length > 0
    ) {
      return true;
    }
    return false;
  } */

  /* componentDidUpdate(oldProps) {
     const newProps = this.props;
    console.log(newProps);
    if (oldProps.leafletMap !== newProps.leafletMap) {
      this.setState({
        leafletMap: newProps.leafletMap,
      });
    } else if (oldProps.popCenters !== newProps.popCenters) {
      this.setState({
        popCenters: newProps.popCenters,
      });
    }
  } */

  async activateGeolocation(reload = false, coords) {
    if (navigator.geolocation && this.state.userCoords.length !== 2) {
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          /* this.setState({
            userCoords: [position.coords.latitude, position.coords.longitude],
          }); */
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
    const districtsInput = document.getElementById('districtsInput');
    this.props.getPlacesDataFunc({
      target: { ...districtsInput, name: 'popCenters' },
    });
  }

  componentDidMount() {
    this.props.getPlacesDataFunc();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', function() {
        textToSpeech();
      });
    } else {
      // languages list available, no need to wait
      textToSpeech();
    }
  }

  render() {
    console.log(this.state);
    this.drawTableChart('drawSecureLocTableChart');
    return (
      <Page
        tableCallback={this.startTableListener}
        // popCenters={this.state.popCenters}
        isDrawable={this.state.isDrawable}
        drawAllCharts={this.drawAllCharts}
        // departments={this.props.departments}
        onChangeChartFilter={
          this.props.getPlacesDataFunc /* this.onChangeChartFilter */
        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //departments: state.placesReducer.departments,
    popCenters: state.placesReducer.popCenters,
    leafletMap: state.mapReducer.leafletMap,
  };
};

const mapDispatchToProps = {
  getPlacesDataFunc: getPlacesDataFuncAction,
  getPlacesData: getPlacesDataAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Charts);
