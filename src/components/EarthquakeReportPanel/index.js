import React from 'react';
import L from 'leaflet';
import { connect } from 'react-redux';

import {
  getEarthquakeData as getEarthquakeDataAction,
  getAllEarthquakeReports as getAllEarthquakeReportsAction,
} from '../../redux/actions';
import ObserverTag from '../../helpers/ObserverTag';

import Page from './page';

class EarthquakeReportPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      today: this.props.report,
      report: this.props.report,
      reports: this.props.reports,
      layers: [],
      wayPoints: [],
      userCoords: [],
    };
    this.initResizer = this.initResizer.bind(this);
    this.getReport = this.getReport.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.leafletMapLayers = this.leafletMapLayers.bind(this);
    this.leafletWayPoints = this.leafletWayPoints.bind(this);
    this.activateGeolocation = this.activateGeolocation.bind(this);
  }

  leafletWayPoints() {
    if (this.state.userCoords.length === 2) {
      const route = L.Routing.control({
        waypoints: [
          L.latLng(this.state.userCoords[0], this.state.userCoords[1]),
          L.latLng(-12.046374, -77.042793),
        ],
        router: new L.Routing.osrmv1({
          language: 'es',
          profile: 'car',
        }),
        //geocoder: L.Control.Geocoder.nominatim({}),
      }).addTo(this.props.leafletMap);
      this.setState({
        wayPoints: [route, ...this.state.wayPoints],
      });
    } else {
      this.activateGeolocation();
    }
  }

  activateGeolocation() {
    if (navigator.geolocation && this.state.userCoords.length !== 2) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            userCoords: [position.coords.latitude, position.coords.longitude],
          });
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

  leafletMapLayers(current) {
    let circle;
    if (current.num === this.state.reports[this.state.reports.length - 1].num) {
      circle = L.circle([current.lat, current.lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 18000, //150000,
        weight: 2,
      });
    } else {
      circle = L.circle([current.lat, current.lng], {
        color: 'orange',
        fillColor: '#fdbcb4',
        fillOpacity: 0.5,
        radius: 18000, //150000,
        weight: 2,
      });
    }
    this.props.leafletMap.addLayer(circle);
  }

  handleReport({ target }) {
    let reportIndx = this.state.report.num;
    let valid = false;
    if (target.id === 'prevRep' && this.state.reports[0].num) {
      reportIndx -= 1;
      valid = true;
    }
    if (
      target.id === 'nextRep' &&
      reportIndx !== this.state.reports[this.state.reports.length - 1].num
    ) {
      reportIndx += 1;
      valid = true;
    }
    if (target.id === 'currentRep') {
      reportIndx = this.state.today.num;
      this.state.layers.forEach((element) => {
        this.props.leafletMap.removeLayer(element[1]);
      });
      valid = true;
    }
    if (target.id === 'allRep') {
      let layersArr = [];
      this.state.reports.forEach((report) => {
        const circle = L.circle([report.lat, report.lng], {
          color: 'orange',
          fillColor: '#fdbcb4',
          fillOpacity: 0.5,
          radius: 18000, //150000,
          weight: 2,
        });
        layersArr.push([report.num, circle]);
        this.props.leafletMap.addLayer(circle);
      });
      this.setState({
        layers: layersArr,
      });
    }
    if (valid) {
      const newCurrent = this.state.reports.filter(
        (report) => report.num === reportIndx,
      )[0];
      this.leafletMapLayers(newCurrent);

      this.setState({
        report: newCurrent,
      });
    }
  }

  initResizer() {
    const ro = new ObserverTag('resize');
    ro.observe('reportPanel', () => {
      const xWidth = window.innerWidth;
      const reportPanel = document.getElementById('reportPanel');
      const checkbox = document.getElementById('reportCtrlCheckbox');
      if (xWidth < 992 && checkbox.checked) {
        reportPanel.style.position = 'relative';
        reportPanel.style.transform = 'translateX(0)';
      } else if (xWidth < 992 && !checkbox.checkbox) {
        reportPanel.style.position = 'relative';
        reportPanel.style.transform = 'translateX(0)';
      } else if (xWidth > 992 && checkbox.checked) {
        reportPanel.style.position = 'absolute';
        reportPanel.style.transform = 'translateX(0%)';
      } else if (xWidth > 992 && !checkbox.checked) {
        reportPanel.style.position = 'absolute';
        reportPanel.style.transform = 'translateX(-100%)';
      }
    });
  }

  async getReport() {
    await this.props.getEarthquakeData();
    await this.props.getAllEarthquakeReports();
  }

  componentDidMount() {
    this.initResizer();
    this.getReport();
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.reports.length !== newProps.reports.length) {
      this.setState({
        today: newProps.reports[newProps.reports.length - 1],
        report: newProps.reports[newProps.reports.length - 1],
        reports: newProps.reports,
      });
    }
  }

  shouldComponentUpdate(nextProps, _nextState) {
    if (nextProps.reports.length > 0) {
      return true;
    }
    return false;
  }

  render() {
    this.activateGeolocation();
    return <Page report={this.state.report} handleReport={this.handleReport} />;
  }
}

const mapStateToProps = (state) => {
  return {
    report: state.earthquakeReducer.earthquakeReport,
    reports: state.earthquakeReducer.earthquakeReports,
  };
};

const mapDispatchToProps = {
  getEarthquakeData: getEarthquakeDataAction,
  getAllEarthquakeReports: getAllEarthquakeReportsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EarthquakeReportPanel);
