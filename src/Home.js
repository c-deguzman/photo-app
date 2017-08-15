import React from 'react';
import $ from 'jquery';

export default class HomePage extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleSumbit = this.handleSubmit.bind(this);
    
    this.state = {
      books: [],
      user: " ",
      auth: false
    }
  }
  
  
  componentDidMount() {
    
    $.ajax({
      type: "POST",
      url: "/get_user",
      contentType: 'application/json'
    }).done((data_user) => {
      
      var auth_state;
      
      if (data_user === false){
        auth_state = false;
      } else {
        auth_state = true;
      }
      
      this.setState({
        user: data_user,
        auth: auth_state
      });
    });
    
  }
  
  handleRedirect(event, target){
    window.location.assign("/poll?id=" + target);
  }

  handleSubmit(event){
    event.preventDefault();
  }
  
  
 
  render() {
    return (
      <div >

        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <div className="navbar-header">
                <a className="navbar-brand" href="/">Book App Epsilon</a>
            </div>
            </div>

            <ul className="nav navbar-nav">
              <li className="active"><a href="#">Home</a></li>
              <li><a href="/add_book">Add Book</a></li>
              <li><a href="/my_books">My Books</a></li>
            </ul> 
            
             
            <p className="navbar-text"> Signed in as {this.state.user} </p> 
           
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/user_settings"><span className="glyphicon glyphicon-cog" /> Settings </a></li>
              <li><a href="/logout"><span className="glyphicon glyphicon-log-out" /> Logout </a></li>
            </ul> 
            
          </div>
        </nav>

        <div className="page-header">
            <h2> All Books </h2> 
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label className="control-label col-md-1 col-md-offset-1" htmlFor="book_search">Search :</label>
                <div className="col-md-6">
                  <input type="text" className="form-control" id="book_search" name="book_search" placeholder="Enter search term here" onChange={this.changeQuery}  required/>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-default" type="submit"> Submit </button>
                </div>
                <div className="col-md-2 col-md-offset-4">
                  <label className="radio-inline"><input type="radio" name="optradio" defaultChecked />ISBN</label>
                  <label className="radio-inline"><input type="radio" name="optradio" />Title</label>
                </div>
              </div>
            </form>
        </div>
        
        
        <div className="container">
          {
            this.state.books.map((item,i) => 
                <li key={i} className="list-group-item" onClick={(e) => this.handleRedirect(e, this.state.poll[i]._id)}> 
                </li>)  
          }
        </div>
        
      </div>
    );
  }
}