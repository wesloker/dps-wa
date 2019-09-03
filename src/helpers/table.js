module.exports = function TableChart(id, options) {
  this.container = {};
  this.id = id;
  this.columns = [];
  this.rows = [];
  this.defaultOpts = {
    styles: {
      width: '500',
    },
  };
  this.thead = document.createElement('thead', {});
  this.tbody = document.createElement('tbody', {});
  this.options = {
    id: options.id,
    styles: {
      width: options.styles.width || this.defaultOpts.styles.width,
    },
    allowHTML: options.allowHTML || false,
  };
  this.chart = document.createElement('table', this.options);
  this.addColumn = (arr) => {
    this.columns.push(arr);
    return this;
  };

  this.addColumns = (columns) => {
    columns.forEach((column) => {
      this.columns.push(column);
    });
    return this;
  };

  this.addColumn = (column) => {
    this.columns.push(column);
    return this;
  };

  this.addRows = (arr) => {
    arr.forEach((row) => {
      this.rows.push(row);
    });
    return this;
  };

  this.addRow = (row) => {
    this.rows.push(row);
    return this;
  };

  this.draw = () => {
    this.columns = this.columns.map((column) => {
      const th = document.createElement('th', {});
      th.setAttribute('class', 'cell');
      const textNode = document.createTextNode(column.value);
      th.appendChild(textNode);
      return th;
    });

    const tdH = document.createElement('tr', {});
    tdH.setAttribute('class', 'row header');

    this.columns.forEach((column) => {
      tdH.appendChild(column);
    });
    this.thead.appendChild(tdH);

    this.chart.appendChild(this.thead);

    const arr = [];

    this.rows.forEach((row) => {
      const tr = document.createElement('tr', {});
      tr.setAttribute('class', 'row');
      row.forEach((val, index) => {
        const htmlRegex = /<[a-z][sS]*>/i;
        const td = document.createElement('td', {});
        td.setAttribute('class', 'cell');
        td.setAttribute('data-title', this.columns[index].textContent);
        if (htmlRegex.test(val)) {
          const textNode = document.createTextNode(val);
          td.appendChild(textNode);
        } else {
          td.innerHTML = val;
        }
        tr.appendChild(td);
      });
      arr.push(tr);
    });
    arr.forEach((el) => {
      this.chart.appendChild(el);
    });
    arr.forEach((el) => {
      this.tbody.appendChild(el);
    });
    this.chart.appendChild(this.tbody);
    this.chart.setAttribute('class', 'table');
    this.container = document.getElementById(this.id);
    this.container.setAttribute('class', 'wrapper');
    this.container.appendChild(this.chart);
  };
  this.addColumn = this.addColumn.bind(this);
  this.addColumns = this.addColumns.bind(this);
  this.addRow = this.addRow.bind(this);
  this.addRows = this.addRows.bind(this);
  this.draw = this.draw.bind(this);
  return {
    addColumn: this.addColumn,
    addColumns: this.addColumns,
    addRow: this.addRow,
    addRows: this.addRows,
    draw: this.draw,
  };
};
