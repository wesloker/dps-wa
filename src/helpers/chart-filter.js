/* eslint-disable array-callback-return */
async function getData(placeType, e, id) {
  const query = `
    query {
      ${placeType}(input: {
        dataType: "${e.name.slice(0, e.name.length - 1)}_id"
        dataValue: "${id}"
      }) {
        _id
        name
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
    }/api/v0.1.0beta/${placeType}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin':
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000'
            : 'https://spd-api.herokuapp.com',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ query }),
    },
  );
  const { data } = await fetchData.json();
  const container = document.getElementById(placeType);
  if (placeType !== 'popCenter') {
    if (container.hasChildNodes()) {
      container.childNodes.forEach((el) => {
        container.removeChild(el);
      });
    }
  }
  data[placeType].forEach((el) => {
    const optionTag = document.createElement('option');
    optionTag.value = el.name;
    optionTag.setAttribute(
      `data-${placeType.slice(0, placeType.length - 1)}id`,
      el._id,
    );
    container.insertAdjacentElement('beforeend', optionTag);
  });
}

export default function onChangeChartFilter({ target: e }) {
  let placeType;
  if (e.name === 'departments') placeType = 'provinces';
  if (e.name === 'provinces') placeType = 'districts';
  if (e.name === 'districts') placeType = 'popCenters';
  if (placeType !== 'popCenters') {
    const childInput = document.getElementById(`${placeType}Input`);
    childInput.value = '';
    const childList = document.getElementById(placeType);
    childList.innerHTML = '';
  }
  const list = document.getElementById(e.name);
  const listItem = Array.from(list.children).find((li) => {
    if (li.getAttribute('value') === e.value) {
      return li.getAttribute(`data-${e.name.slice(0, e.name.length - 1)}id`);
    }
  });
  let id;
  if (typeof listItem !== 'undefined') {
    id = listItem.getAttribute(`data-${e.name.slice(0, e.name.length - 1)}id`);
    getData(placeType, e, id);
  }
}
