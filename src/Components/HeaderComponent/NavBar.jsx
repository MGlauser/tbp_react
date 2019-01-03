import React, { Component } from 'react';
import Collapse from './Collapse';

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <Collapse />
        </div>
      </nav>
    )
  }
}
export default NavBar;
