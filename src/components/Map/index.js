import React from 'react';
import './styles.css';
import Page from './page';

import { connect } from 'react-redux';
import { setMapInstance as setMapInstanceAction } from '../../redux/actions';

import * as L from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import 'leaflet-routing-machine';

import 'leaflet/dist/leaflet.css';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leafletMap: {},
    };
    this.drawMap = this.drawMap.bind(this);
    this.handleOnClickRPC = this.handleOnClickRPC.bind(this);
  }

  drawMap() {
    let lat, lng;
    /* if (document.getElementById('data-lat').textContent.trim().length === 1) {
      lat = -9.1899672;
    } else {
      lat = document.getElementById('data-lat').textContent;
    }
    if (document.getElementById('data-lng').textContent.trim().length === 1) {
      lng = -75.015152;
    } else {
      lng = document.getElementById('data-lng').textContent;
    } */
    lat = -9.1899672;
    lng = -75.015152;
    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
    const map = L.map('map', {
      center: [lat, lng],
      minZoom: 6,
      zoom: 6,
      gestureHandling: true,
    }).setView([lat, lng], 6);
    const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    L.tileLayer(tileURL, { attribution }).addTo(map);
    this.props.setMapInstance(map);
    this.setState({
      leafletMap: map,
    });
  }

  handleOnClickRPC({ target: checkbox }) {
    const reportPanel = document.getElementById('reportPanel');
    const reportPanelCtrl = document.getElementById('reportPanelCtrl');
    if (checkbox.checked) {
      reportPanel.style.transform = 'translateX(100%)';
      reportPanelCtrl.style.transform = 'translateX(-100%)';
    } else if (!checkbox.checked) {
      reportPanel.style.transform = 'translateX(-100%)';
      reportPanelCtrl.style.transform = 'translateX(-280px)';
    }
  }

  componentDidMount() {
    this.drawMap();
  }

  render() {
    return (
      <Page
        leafletMap={this.state.leafletMap}
        handleOnClickRPC={this.handleOnClickRPC}
      />
    );
  }
}

const mapDispatchToProps = {
  setMapInstance: setMapInstanceAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(LeafletMap);
