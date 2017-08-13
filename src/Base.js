import React from 'react';
import Alert from './Alert';

export default class Base extends React.Component {

    constructor(props){
      super(props);
      this.render = this.render.bind(this);
    }

    render() {
      
      return (
        
        <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <div className="navbar-header">
                <a className="navbar-brand" href="#">Book App Epsilon</a>
            </div>
            </div>

            <p className="navbar-text">Not signed in</p>
            
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/register"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
              <li><a href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul> 
          </div>
        </nav>
          
          
        <div>
        <div id="image_base">
          <div id="opacity-overlay">
            
            <div className="centre">
              <h1 id="title"> Book App Epsilon </h1>
            </div>
            
            <div id="claims">
              <h3 className="claim centre"> The books you want. </h3>
              <h3 className="claim centre"> The prices you set. </h3>
              <h3 className="claim centre"> The most for you. </h3>
              <h2 className="claim centre"> Free. </h2>
            </div>
            
            <div id="instructions" className="centre">
              <div className="step">
                <h3> Sign up / Login</h3>
                <span className="glyphicon glyphicon-user"></span>
              </div>
              <div className="gap" />
              <div className="step">
                <h3> Upload Books </h3>
                <span className="glyphicon glyphicon-cloud-upload"></span>
              </div>
              <div className="gap" />
              <div className="step">
                <h3> Make Trades</h3>
                <span className="glyphicon glyphicon glyphicon-transfer"></span>
              </div>
            </div>
           
          </div>
        </div>
        </div>
          
      </div>
    );
  }
}