export default async function startGoogleCharts() {
  /* await GoogleCharts.load(onLoad, { packages: ['corechart', 'bar', 'table'] }); */
}

/* export default async function startGoogleCharts() {
  await google.charts.load('current', {
    packages: ['corechart', 'bar', 'table'],
  });
  google.charts.setOnLoadCallback(onLoad);
}

export default async function startGoogleCharts() {
  await GoogleCharts.load(onLoad, { packages: ['corechart', 'bar', 'table'] });
}
async function onLoad() {
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
    `http://localhost:4000/api/v0.1.0beta/popcenters`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query }),
    },
  );
  const { data } = await fetchData.json();
  drawCharts(data);
  drawSecureLocTable(data);
  drawDisabledPopChart();
}

function drawSecureLocTable(data) {
  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn('string', 'Centro Poblado');
  dataTable.addColumn('number', 'habs.');
  dataTable.addColumn('boolean', 'En Riesgo');
  data.popCenters.forEach((popCenter) => {
    dataTable.addRow([
      popCenter.name,
      {
        v: popCenter.population.total,
        f: `${popCenter.population.total} hab.`,
      },
      true,
    ]);
  });

  const table = new google.visualization.Table(
    document.getElementById('drawSecureLocTable'),
  );

  table.draw(data, { showRowNumber: true, width: '50%', height: '100%' });
}

function drawCharts(data) {
  const chartData = google.visualization.arrayToDataTable([
    ['Categoría', 'Población', { type: 'string', role: 'annotation' }],
    [
      'Total',
      data.popCenters[0].population.total,
      `${data.popCenters[0].population.total}k`,
    ],
    [
      'Hombres',
      data.popCenters[0].population.male,
      `${data.popCenters[0].population.male}k`,
    ],
    [
      'Mujeres',
      data.popCenters[0].population.female,
      `${data.popCenters[0].population.female}k`,
    ],
  ]);

  const options = {
    title: 'Población según sexo',
    width: 500,
    height: 200,
    chartArea: { width: '50%' },
    legend: { position: 'right', maxLines: 3 },
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: 12,
        auraColor: 'none',
        color: '#555',
      },
      boxStyle: {
        stroke: '#ccc',
        strokeWidth: 1,
        gradient: {
          color1: '#f3e5f5',
          color2: '#f3e5f5',
          x1: '0%',
          y1: '0%',
          x2: '100%',
          y2: '100%',
        },
      },
    },
    hAxis: {
      title: 'Población Total',
      minValue: 0,
    },
    vAxis: {
      title: 'Sexo',
    },
  };

  const chart = new google.visualization.BarChart(
    document.getElementById('populationChart'),
  );
  chart.draw(chartData, options);
}

function drawDisabledPopChart() {
  const data = google.visualization.arrayToDataTable([
    ['Población', 'Cantidad'],
    ['Sin Discapacidad', Math.random() * 100],
    ['Discapacitados', Math.random() * 10],
  ]);
  const options = {
    title: 'Población Discapacitada',
    // width: 310,
    // height: 160,
  };
  const chart = new google.visualization.PieChart(
    document.getElementById('disabledPopulationChart'),
  );
  chart.draw(data, options);
}
 */
