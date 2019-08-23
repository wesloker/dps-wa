import React from 'react';
import ReactDOM from 'react-dom';
import './normalize.css';
import './styles.css';
import Home from './components/Home/';
import { Provider } from 'react-redux';
import store from './redux/store';
//import * as serviceWorker from './serviceWorker';

const App = (
  <Provider store={store}>
    <Home />
  </Provider>
);

ReactDOM.render(App, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
