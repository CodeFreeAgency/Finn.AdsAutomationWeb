import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PageNotFound404 from '../../assets/images/file-search-icon.png';
import './style.css';
export default class Page404 extends Component {
  port = chrome.runtime.sendMessage('test')
  render() {
    console.log("Extension exist: ", this.port);
    return (
      <div className='notfound-cont'>
        <div className='notfound-inner'>
          <div className='page-404-icon'>
            <div className='txt-404'>404</div>
          <img src={PageNotFound404} alt='back-arrow' className='File Search' />
          </div>
          <h3>Page Not Found.</h3>
          <div className="mb-3">
            <p>
              We're sorry, the page you requested could not be found on the server. Please go back to the main page.
            </p>
          </div>
          <div className="d-grid">
          <Link to="/sign-in">
            <button className='btn btn-primary' type='button'>
              Go to Main Login
            </button>
          </Link>
          </div>
        </div>
      </div>
    )
  }
}