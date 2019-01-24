import React, { Component } from 'react';

// eslint-disable-next-line
import { BrowserRouter as Route, Link } from 'react-router-dom';
// import ReactDOM from 'react-dom';

import cx from 'classnames';
import Tree from 'react-ui-tree';
// import tree from './tree';
import axios from 'axios';

// import path from 'path';
import config from '../../config';
import Gallery from './Gallery';


const env = process.env.NODE_ENV || 'development';

class AlbumsPage extends Component {
  constructor(props) {
    super(props);
    let uri = config[env].api + '/api/albums';
    // console.log("URI: ", uri);
    axios.get(uri).then((res) => {
      // console.log("here.");
      // console.dir(res);
      this.handleChange(res.data);
    }).catch((err) => {
      console.error(err);
    });
  }

  state = {
    active: null,
    tree: {}
  };

  renderNode = node => {
    return (
        <span
        className={cx('node', {
          'is-active': node === this.state.active
        })}
        onClick={this.onClickNode.bind(null, node)}
        >
          <Link to={{
            pathname: "/albums",
            search: "?name=" + node.album,
            state: { public: true } // set this dynamicaly later.
          }}
          >
            {node.module}
        </Link>
      </span>
    )
  };

  onClickNode = node => {
    this.setState({
      active: node,
      images: []
    });
    this.fetchImages(node.album);
  };

  fetchImages = folder => {
    if (!folder || folder === 'Albums') {
      this.setState(Object.assign({}, this.state, { images: [] }));
      return;
    }

    // let uri = config[env].api + '/api/albums/show?album=' + folder;
    let uri = config[env].api + '/api/albums/' + folder.split('/').join('|');
    // console.log("URI: ", uri);
    axios.get(uri).then((res) => {
      // console.log("here.");
      // console.dir(res);
      this.setState(Object.assign({}, this.state, { images: res.data }));
      // console.dir(this.state);
    }).catch((err) => {
      console.error(err);
      return [];
    });
  }

  RImages = (menu) => {
    // console.log("RImages: ", JSON.stringify(this.state.images));
    // console.dir(menu);
    if (this && this.state.images && typeof ((this.state.images) === "object") && this.state.images.length > 0) {
      let images = [];
      this.state.images.map(function (key) {
        let src = config[env].api + '/' + menu.folder + '/' + key;
        images.push({ src: src, caption: key });
        // console.log("src: ", JSON.stringify(src));
        // return <img key={key} src={src} alt={key} className="img-responsive" />
        return images.length;
      });
      return (
        <Gallery heading={menu.folder} isOpen={true} showThumbnails={true} images={images} key={menu.folder} />
      );
    } else {
      return (
        <div className="container">
          <h3>{menu.folder}</h3>
          <div>No images here to show.  Go further down the tree.</div>
        </div>

      )
    }
  }

  Child = name => {
    let folder = name && name.name;

    return (
      <div className="main">
        {folder ?
          (folder === "Albums" ?
            (
              <h3>Select an album</h3>
            )
            :
            (
              <this.RImages folder={folder} />
            )) : (
            <h3>
              Down the left side are a list of albums to explore.  Select one to show that Gallery.
            </h3>
          )}
      </div>
    );
  }

  render() {
    // eslint-disable-next-line
    let params = new URLSearchParams(location.search);
    return (
      <div className='page-content'>
        <div className="albums-nav">
          <div className="sidenav">
            <div id='albums-tree'>
              <Tree
                paddingLeft={20}              // left padding for children nodes in pixels
                tree={this.state.tree}        // tree object
                onChange={this.handleChange}  // onChange(tree) tree object changed
                renderNode={this.renderNode}  // renderNode(node) return react element
              />
            </div>
          </div>
        </div>
        <this.Child name={params.get("name")} />
      </div>
    )
  };

  handleChange = tree => {
    this.setState({
      tree: tree
    });
  };

  updateTree = () => {
    const { tree } = this.state;
    tree.children.push({ module: 'test' });
    this.setState({
      tree: tree
    });
  };
}
export default AlbumsPage;