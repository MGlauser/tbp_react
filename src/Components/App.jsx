import React, { Component } from 'react';

// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';

// eslint-disable-next-line
import { browserHistory } from 'react-router';

import NavBar from './HeaderComponent/NavBar';
import Footer from './FooterComponent/Footer';

import HomePage from './HomePage';
import AboutPage from './AboutPage';
import PricesPage from './PricesPage';
import AlbumsPage from './AlbumComponent/AlbumsPage';


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Route name="home" exact path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/prices" component={PricesPage} />
          <Route path="/albums" component={AlbumsPage} />
          <Footer />
        </div>
      </Router>
    )
  }
}
export default App;