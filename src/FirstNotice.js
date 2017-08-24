import React from 'react';
import $ from 'jquery';
import Alert from './Alert';
import Confirm from 'react-confirm-bootstrap';
import Navbar from './Navbar';

export default class FirstNotice extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.handle_submit = this.handle_submit.bind(this);

    this.state = {
      result: "n/a",
      error: "",
      error_show: true
    }
  }

  handle_submit(event){
  	event.preventDefault();

      var disp = event.target.disp.value;

      console.log(disp);

      $.ajax({
        type: "POST",
        url: "/set_disp",
        contentType: 'application/json',
        data: JSON.stringify({displayName: disp})
      }).done((disp_data) => {

      	console.log(disp_data);

        if (disp_data.result == "error"){
          this.setState({
            error_show: true,
            result: "error",
            error: disp_data.error
          });
        } else if (disp_data.result == "success"){
          window.location.href = "/home";
        }
      });
  }
  
  render(){
    return (
      <div>
        <Navbar logged_in={true} user="???"/>
        <div className="centre">
          <div id="notice_box">
            <h1 id="title"> Hey there! </h1>
            <p className="basic"> Looks like it's your first time with us <i className="em em-smirk" />! It's always nice to have new faces <i className="em em-baby" />. We excitedly welcome <strong>you</strong> to the Photo App Zeta community (it's gonna be <i className="em em-fire" />  with you here <i className="em em-100" />). But, we're at a loss  <i className="em em-anguished" /><i className="em em-cold_sweat" /> ... We don't know your name! Please choose a display name that's as beautiful as you are <i className="em em-sparkling_heart"/> ~ thanks! </p>
            
            <div className="centre">
              <form className="form-horizontal" onSubmit={this.handle_submit}>
	            <div className="form-group">
	              <label className="control-label col-sm-8" htmlFor="disp">Display Name:</label>
	              <div className="col-sm-12">
	                <input type="text" className="form-control" id="disp" name="disp" placeholder="Enter display name" required/>
	              </div>
	            </div>

	            <div className="form-group"> 
	              <div className="col-sm-10">
	                <button type="submit" className="btn btn-default">Continue</button>
	              </div>
	            </div>
	          </form>
        	</div>

        	<p className="basic"> Psst. You can change your display name later if you want. </p>
          </div>
        </div>

        <Alert show={this.state.error_show} changeShow={() => this.setState({error_show: false})} result={this.state.result} error={this.state.error} success={"Your display name has been successfully set."} /> :

      </div>);
  }
}