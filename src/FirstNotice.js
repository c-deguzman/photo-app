import React from 'react';
import $ from 'jquery';
import Alert from './Alert';
import Confirm from 'react-confirm-bootstrap';
import Navbar from './Navbar';

export default class FirstNotice extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
  }
  
  render(){
    return (
      <div>
        <Navbar logged_in={false} />
        <div className="centre">
          <div id="notice_box">
            <h1 id="title"> Hey there! </h1>
            <p className="basic"> Looks like it's your first time with us <i className="em em-smirk" />! It's always nice to have new faces <i className="em em-baby" />. We excitedly welcome <strong>you</strong> to the Photo App Zeta community (it's gonna be <i className="em em-fire" />  with you here <i className="em em-100" />). But, we're at a loss  <i className="em em-anguished" /><i className="em em-cold_sweat" /> ... We don't know your name! Please choose a unique display name that's as beautiful as your unique personality <i className="em em-sparkling_heart"/> ~ thanks! </p>
            
            
            <div className="centre">
              <form className="form-horizontal" onSubmit={this.handle_submit}>
            <div className="form-group">
              <label className="control-label col-sm-8" htmlFor="disp">Display Name:</label>
              <div className="col-sm-12">
                <input type="text" className="form-control" id="disp" name="disp" placeholder="Enter display name"  pattern="^[A-Za-z0-9_-]{3,15}$" oninvalid="setCustomValidity('Display name must be between 3 and 15 characters.')" required/>
              </div>
            </div>

            <div className="form-group"> 
              <div className="col-sm-10">
                <button type="submit" className="btn btn-default">Continue</button>
              </div>
            </div>
          </form>
            </div>
            
            
          </div>
        </div>
      </div>);
  }
}