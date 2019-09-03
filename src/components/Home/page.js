import React from 'react';
import './styles.css';

import NavBar from '../NavBar/';
import LeafletMap from '../LeafletMap/';
import Charts from '../Charts/';
import Footer from '../Footer/';

function Page() {
  return (
    <React.Fragment>
      <NavBar />
      <LeafletMap />
      <Charts />
      <Footer />
    </React.Fragment>
  );
}

export default Page;
