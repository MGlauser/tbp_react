import React, { Component } from 'react';
class Footer extends Component {
  constructor(props) {
    super(props);
    let now = new Date();
    this.state = {
      year: now.getFullYear(),
    };
  }

  render() {
    
    return (
      <footer className="navbar navbar-inverse navbar-fixed-bottom">
        <div className="container-fluid">
          Copyright &copy;{this.state.year} Timeless Beauty Photography. All Rights Reserved.
        </div>
      </footer>
    )
  }
}
export default Footer;
