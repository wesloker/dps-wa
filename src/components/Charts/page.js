import React from 'react';
import './styles.css';

import Chart from 'react-google-charts';

function Page(props) {
  const { departments, popCenters } = props;
  let arr = [];
  props.isDrawable &&
    popCenters.popCenters.forEach((el) => {
      arr.push([
        el.name,
        {
          v: el.population.total,
          f: el.population.total.toString(),
        },
        {
          v: el.population.male,
          f: el.population.male.toString(),
        },
        {
          v: el.population.female,
          f: el.population.female.toString(),
        },
        Boolean(Math.round(Math.random())),
        `<span data-route='goTo' data-latLng='-12.046374, -77.042793'>Ir</span>`,
      ]);
    });
  // ['Centro Poblado 1', { v: 1000, f: '1,000' }, true];
  return (
    <div className="container-full graphs-content">
      <div className="container datalists">
        <div className="datalists__form">
          <label className="list-label" htmlFor="depList">
            Seleccione un Departamento
          </label>
          <input
            type="text"
            id="departmentsInput"
            name="departments"
            list="departments"
            placeholder="Departamento"
            onChange={props.onChangeChartFilter}
          />
          <datalist id="departments">
            {typeof departments !== 'undefined' &&
              departments !== null &&
              (departments.length !== 0 &&
                departments.map((department) => {
                  return (
                    <option
                      key={department._id}
                      data-departmentid={department._id}
                      value={department.name}
                    />
                  );
                }))}
          </datalist>
        </div>
        <div className="datalists__form">
          <label className="list-label" htmlFor="provList">
            Seleccione una Provincia
          </label>
          <input
            type="text"
            id="provincesInput"
            name="provinces"
            list="provinces"
            placeholder="Provincia"
            onChange={props.onChangeChartFilter}
          />
          <datalist id="provinces" />
        </div>
        <div className="datalists__form">
          <label className="list-label" htmlFor="distList">
            Seleccione un Distrito
          </label>
          <input
            type="text"
            id="districtsInput"
            name="districts"
            list="districts"
            placeholder="Distrito"
          />
          <datalist id="districts" />
        </div>
        <div className="datalists__form">
          <input
            type="button"
            className="submitform"
            value="Consultar"
            onClick={props.drawAllCharts}
          />
          <input type="button" className="geoBtn" value="Geolocalizar" />
        </div>
      </div>
      <div className="container charts">
        <div id="populationChart" className="chart">
          {props.isDrawable && (
            <Chart
              /*width={'400px' default: 500px }
              height={'300px'}*/
              chartType="BarChart"
              loader={<div>Cargando Datos...</div>}
              data={[
                ['Tipo', 'Población'],
                ['Total', Math.random() * 100],
                ['Hombres', Math.random() * 100],
                ['Mujeres', Math.random() * 100],
              ]}
              options={{
                title: 'Población según sexo',
                chartArea: { width: '50%' },
                hAxis: {
                  title: 'Población Total',
                  minValue: 0,
                },
                vAxis: {
                  title: 'Sexo',
                },
              }}
            />
          )}
        </div>
        <div id="disabledPopulationChart" className="chart">
          {props.isDrawable && (
            <Chart
              width={'400px' /* default: 500px */}
              height={'300px'}
              chartType="PieChart"
              loader={<div>Cargando Datos...</div>}
              data={[
                ['Tipo', 'Población'],
                ['Total', Math.random() * 100],
                ['Hombres', Math.random() * 100],
                ['Mujeres', Math.random() * 100],
              ]}
              options={{
                title: 'Personas con Discapacidad',
              }}
            />
          )}
        </div>
      </div>
      <div className="container table">
        <div id="drawSecureLocTable">
          {props.isDrawable && (
            <Chart
              width={'100%'}
              height={'400px'}
              chartType="Table"
              loader={<div>Cargando Datos...</div>}
              chartPackages={['table']}
              chartEvents={[
                {
                  eventName: 'ready',
                  callback: props.tableCallback,
                },
              ]}
              data={[
                [
                  { type: 'string', label: 'Nombre' },
                  { type: 'number', label: 'Población Total' },
                  { type: 'number', label: 'Hombres' },
                  { type: 'number', label: 'Mujeres' },
                  { type: 'boolean', label: 'Zona Segura' },
                  { type: 'string', label: 'Rutas' },
                ],
                ...arr,
              ]}
              options={{
                showRowNumber: true,
                allowHtml: true,
              }}
              /* style={{
                textAlign: 'center',
              }} */
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
