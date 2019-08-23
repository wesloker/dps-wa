import React from 'react';
import './styles.css';

function Page(props) {
  const report = props.report;
  return (
    <div className="container-full map-report" id="reportPanel">
      <div className="container report-panel">
        <div className="report-panel__report">
          <div className="report-panel__data-source">
            <p>
              Fuente:&nbsp;<a href="http://ultimosismo.igp.gob.pe">IGP</a>
            </p>
          </div>
          <div className="report__header">
            <h2 className="report__title">
              Reporte S&iacute;smico N° {report.num}
            </h2>
          </div>
          <div className="report__content">
            <div className="report__field">
              <div className="report__name">
                <h3>Fecha:</h3>
              </div>
              <div className="report__value">
                <p>{report.date}</p>
              </div>
            </div>
            <div className="report__field">
              <div className="report__name">
                <h3>Hora Local:</h3>
              </div>
              <div className="report__value">
                <p>{report.localtime}</p>
              </div>
            </div>
            <div className="report__field">
              <div className="report__name">
                <h3>Magnitud:</h3>
              </div>
              <div className="report__value">
                <p>{report.mag}</p>
              </div>
            </div>
            <div className="report__field">
              <div className="report__name">
                <h3>Referencia:</h3>
              </div>
              <div className="report__value">
                <p>{report.ref}</p>
              </div>
            </div>
            <div className="report__field">
              <div className="report__name">
                <h3>Latitud (°):</h3>
              </div>
              <div className="report__value" id="data-lat">
                <p>{report.lat}</p>
              </div>
            </div>
            <div className="report__field">
              <div className="report__name">
                <h3>Longitud (°):</h3>
              </div>
              <div className="report__value" id="data-lng">
                <p>{report.lng}</p>
              </div>
            </div>
            <div className="report__field">
              <div className="report__name">
                <h3>Profundidad:</h3>
              </div>
              <div className="report__value">
                <p>{report.depth}km</p>
              </div>
            </div>
            <div className="report__field">
              <div className="report__name">
                <h3>Intensidad:</h3>
              </div>
              <div className="report__value">
                <p>{report.intensity}</p>
              </div>
            </div>
          </div>
          <div className="report__legend">
            <div className="legend__item">
              <div className="legend__icon icon-low" />
              <div className="legend__desc">
                <span className="item-desc">&lt; 4.5</span>
              </div>
            </div>
            <div className="legend__item">
              <div className="legend__icon icon-mid" />
              <div className="legend__desc">
                <span className="item-desc">4.5 - 6.0</span>
              </div>
            </div>
            <div className="legend__item">
              <div className="legend__icon icon-danger" />
              <div className="legend__desc">
                <span className="item-desc">&gt; 6.0</span>
              </div>
            </div>
          </div>
          <div className="report__controls">
            <span
              className="controls__button"
              id="prevRep"
              onClick={props.handleReport}
            >
              Anterior
            </span>
            <span
              className="controls__button"
              id="currentRep"
              onClick={props.handleReport}
            >
              Actual
            </span>
            <span
              className="controls__button"
              id="allRep"
              onClick={props.handleReport}
            >
              Todos
            </span>
            <span
              className="controls__button"
              id="nextRep"
              onClick={props.handleReport}
            >
              Siguiente
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
