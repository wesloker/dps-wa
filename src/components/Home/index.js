import React from 'react';
import './styles.css';

import Page from './page';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <Page />;
  }
}

export default Home;
