import React from 'react';
import './styles.css';

import NavBar from '../NavBar/';
import Map from '../Map/';
import Charts from '../Charts/';

function Page(props) {
  return (
    <React.Fragment>
      <NavBar />
      <Map />
      <Charts />
    </React.Fragment>
  );
}

export default Page;
