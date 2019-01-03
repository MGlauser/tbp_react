// eslint-disable-next-line
import React, { Component } from 'react';

// eslint-disable-next-line
import { Link } from 'react-router-dom';

class Collapse extends React.Component {
  constructor(props) {
    super(props)

    // toggle "show" CSS class using plain JS
    this.collapseRef = (id) => {
      if (this.a) this.a.classList.toggle('show')
    }
  }

  render() {
    return (
      <div>
        <div className="navbar-header">
          <button
            className='navbar-toggle'
            type="button"
            onClick={() => this.collapseRef('menu_top')}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link className="navbar-brand" to="/">Timeless Beauty Photography</Link>
        </div>
      
        <div
          className="collapse navbar-collapse"
          // Use the `ref` callback to store a reference to the collapsible DOM element
          ref={(elem) => this.a = elem}
          id="menu_top"
        >
          <ul className="nav navbar-nav navbar-right">
            <li><Link to="/" onClick={() => this.collapseRef('menu1')}>Home</Link></li>
            <li><Link to="/about" onClick={() => this.collapseRef('menu1')}>About</Link></li>
            <li><Link to="/prices" onClick={() => this.collapseRef('menu1')}>Prices</Link></li>
            <li><Link to="/albums" onClick={() => this.collapseRef('menu1')}>Albums</Link></li>
          </ul>
        </div>
    </div>
    )
  }
}

export default Collapse;
