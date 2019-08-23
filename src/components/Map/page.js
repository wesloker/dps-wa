import React from 'react';
import './styles.css';

import EarthquakeReportPanel from '../EarthquakeReportPanel/';

function Page(props) {
  return (
    <div className="container-full bg-secondary">
      <div className="container map">
        <div id="map" />
        <div className="report-panel-ctrl" id="reportPanelCtrl">
          <label className="icon-label">
            X
            <input
              type="checkbox"
              id="reportCtrlCheckbox"
              onClick={props.handleOnClickRPC}
            />
          </label>
        </div>
        <EarthquakeReportPanel leafletMap={props.leafletMap} />
      </div>
    </div>
  );
}

export default Page;
