import React from 'react';
import $ from "jquery";
import Alert from './Alert';


export default class Settings extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handle_submit = this.handle_submit.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeProv = this.changeProv.bind(this);
    this.changeCity = this.changeCity.bind(this);
    
    this.state = {
      status: "Not Sent",
      error_show: true,
      user_name: "",
      user_prov: "",
      user_city: ""
    }
  }

  componentDidMount() {
    
    $.ajax({
      type: "POST",
      url: "/get_user",
      contentType: 'application/json'
    }).done((data_user) => {
      this.setState({
        user: data_user
      }, () => 
        $.ajax({
          type: "POST",
          url: "/get_user_info",
          contentType: 'application/json'
        }).done((data) => {
          this.setState({
            user_name: data.name,
            user_prov: data.prov,
            user_city: data.city
          });
        })
      );
    });
    
  }
  
  handle_submit(event) {
    
    event.preventDefault();
    
    var name = event.target.name.value;
    var prov = event.target.prov.value;
    var city = event.target.city.value;
    
    var send_data = {name: name, prov: prov, city: city};
    
    
    var request = $.ajax({
      type: "POST",
      url: "/update_info",
      contentType: 'application/json',
      data: JSON.stringify(send_data),
    });
    
    request.done((data) => {
        
        if (data.result == "error"){
          this.setState({
            status: data.result,
            error: data.error,
            error_show: true
          });
        } else {
          this.setState({
            status: data.result,
            error_show: true
          });
        }
      });
      
  }

  changeName(event){
    this.setState({
      user_name: event.target.value
    })
  }

  changeProv(event){
    this.setState({
      user_prov: event.target.value
    })
  }

  changeCity(event){
    this.setState({
      user_city: event.target.value
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <div className="navbar-header">
                <a className="navbar-brand" href="/">Book App Epsilon</a>
            </div>
            </div>

            <ul className="nav navbar-nav">
              <li><a href="/Home">Home</a></li>
              <li><a href="/add_book">Add Book</a></li>
              <li><a href="/my_books">My Books</a></li>
            </ul> 
             
            <p className="navbar-text"> Signed in as {this.state.user} </p> 
           
            <ul className="nav navbar-nav navbar-right">
              <li className="active"><a href="/user_settings"><span className="glyphicon glyphicon-cog" /> Settings </a></li>
              <li><a href="/logout"><span className="glyphicon glyphicon-log-out" /> Logout </a></li>
            </ul> 
            
          </div>
        </nav>

        <div className="page-header container">
            <h2 className="centre"> Change User Info </h2>
        </div>
        
        <div className="container">
          <form className="form-horizontal" onSubmit={this.handle_submit}>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="name">Full Name:</label>
              <div className="col-sm-8">
                <input type="text" className="form-control" id="name" name="name" placeholder="Enter full name" value={this.state.user_name} onChange={this.changeName}/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="prov">Province / State:</label>
              <div className="col-sm-8">
                <input type="text" className="form-control" id="prov" name="prov" placeholder="Enter province or state" value={this.state.user_prov} onChange={this.changeProv}/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="city">City:</label>
              <div className="col-sm-8"> 
                <input type="text" className="form-control" id="city" name="city" placeholder="Enter city" value={this.state.user_city} onChange={this.changeCity}/>
              </div>
            </div>

            <div className="form-group"> 
              <div className="col-sm-10 col-sm-offset-2">
                <button type="submit" className="btn btn-default">Submit</button>
              </div>
            </div>
          </form>
        </div>

        {/*
        <div className="page-header">
            <h2 className="centre"> Current User Info </h2>
        </div>

        
        <div className="container">
          <div className="col-sm-2 col-sm-offset-2">
            <p> Name: </p>
          </div>
          <div className="col-sm-8">
            <p> {(this.state.user_name == "" ? "Not Set" : this.state.user_name)} </p>
          </div>

          <div className="col-sm-2 col-sm-offset-2">
            <p> Province / State: </p>
          </div>
          <div className="col-sm-8">
            <p> {(this.state.user_prov == "" ? "Not Set" : this.state.user_prov)} </p>
          </div>

          <div className="col-sm-2 col-sm-offset-2">
            <p> City: </p>
          </div>
          <div className="col-sm-8">
            <p> {(this.state.user_city == "" ? "Not Set" : this.state.user_city)} </p>
          </div>
        </div>
        */}
        <Alert show={this.state.error_show} changeShow={() => this.setState({error_show: false})} result={this.state.status} error={this.state.error} success={"Account information updated successfully."} /> :


      </div>
    );
  }
}