import React from 'react';
import $ from 'jquery';
import Confirm from 'react-confirm-bootstrap';

export default class MyBooks extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.get_city = this.get_city.bind(this);
    this.get_prov = this.get_prov.bind(this);
    this.get_to = this.get_to.bind(this);
    this.get_from = this.get_from.bind(this);
    this.count_reqs = this.count_reqs.bind(this);
    
    this.state = {
      all_books: [],
      my_books: [],
      my_reqs: [],
      books: [],
      user: " ",
      no_img: "https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg",
      mode: "My Books",
      req_mode: "mine",
      to_reqs: [],
      from_reqs: []
    }
  }

  get_city(){
    $.ajax({
      type: "POST",
      url: "/get_sim_users",
      contentType: 'application/json',
      data: JSON.stringify({mode: "city"})
    }).done((data) => {
      this.setState({
        city_users: data
      });
    });
  }

  get_prov(){
    $.ajax({
      type: "POST",
      url: "/get_sim_users",
      contentType: 'application/json',
      data: JSON.stringify({mode: "prov"})
    }).done((data) => {
      this.setState({
        prov_users: data
      });
    });
  }

  get_to(){
    $.ajax({
      type: "POST",
      url: "/get_requests",
      contentType: 'application/json',
      data: JSON.stringify({mode: "to"})
    }).done((data) => {
      this.setState({
        to_reqs: data
      });
    });
  }

  get_from(){
    $.ajax({
      type: "POST",
      url: "/get_requests",
      contentType: 'application/json',
      data: JSON.stringify({mode: "from"})
    }).done((data) => {

      data.sort((a, b) => b.time - a.time);

      this.setState({
        from_reqs: data
      });
    });
  }

  count_reqs(id){
    var total = 0;

    for (var i in this.state.to_reqs){
      if (this.state.to_reqs[i].book_id == id){
        total += 1;
      }
    }

    return total;
  }

  formatTime(unix){
    var a = new Date(unix * 1000);

    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();

    var hours = a.getHours();
    var minutes = a.getMinutes();

    return "" + month + " " + date + ", " + year + " @ " + (hours <= 9 ? "0" : "") +  hours + ":" + (minutes <= 9 ? "0" : "") + minutes;

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
          url: "/get_books",
          contentType: 'application/json'
        }).done((data) => {
          this.setState({
            all_books: data.books.filter((item) => (item.user == data_user)),
            books: data.books.filter((item) => (item.user == data_user))
          }, () => {
            this.get_city();
            this.get_prov();
            this.get_to();
            this.get_from();
          });
        })
      );
    });
    
  }
  
  handleRedirect(event, target){
    window.location.assign("/book?id=" + target);
  }

  handleSubmit(event){
    event.preventDefault();

    var mode = event.target.search_by.value;
    var lookup = event.target.book_search.value;

    var book_results = [];

    if (mode == "isbn"){
      book_results = this.state.all_books.filter((item) => (item.isbn == lookup));
    } else if (mode == "title"){
      book_results = this.state.all_books.filter((item) => (item.title.toLowerCase().indexOf(lookup.toLowerCase()) != -1));
    }

    this.setState({
      books: book_results,
      mode: "Search Results"
    });
  
  }

  isbn_to_cover(isbn){
    return ("https://covers.openlibrary.org/b/isbn/"+ isbn + "-M.jpg?default=false");
  }

  formatTitle(title){

    var limit = 15;

    if (title.length < limit){
      return title;
    }

    return (title.slice(0, limit - 3) + "...");
  }

  formatMessage(msg){
    if (msg != ""){
      return "\"" + msg +  "\"";
    }

    return "You did not send a personalized message.";
  }

  removeRequest(id){
    $.ajax({
      type: "POST",
      url: "/rm_request",
      contentType: 'application/json',
      data: JSON.stringify({id: id})
    }).done((data) => {
      if (data.result == "success"){
       this.get_from();
      }
    });
  }

  directToBook(id){
    window.location.href = "/book?id=" + id;
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
              <li><a href="/home">Home</a></li>
              <li><a href="/add_book">Add Book</a></li>
              <li className="active"><a href="/my_books">My Requests</a></li>
            </ul> 
             
            <p className="navbar-text"> Signed in as {this.state.user} </p> 
           
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/user_settings"><span className="glyphicon glyphicon-cog" /> Profile </a></li>
              <li><a href="/logout"><span className="glyphicon glyphicon-log-out" /> Logout </a></li>
            </ul> 
          </div>
        </nav>

        <div className="page-header container">
          {
            this.state.req_mode == "mine" ? 
            <h2 className="centre"> Search Incoming Requests &nbsp;<span className="badge badge-danger">{this.state.to_reqs.length}</span></h2> : 
            <h2 className="centre"> Outgoing Requests  &nbsp;<span className="badge badge-danger">{this.state.from_reqs.length}</span></h2>
          }
              
          { this.state.req_mode == "mine" ?
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label className="control-label col-md-3" htmlFor="book_search">Search :</label>
                <div className="col-md-6">
                  <input type="text" className="form-control" id="book_search" name="book_search" placeholder="Enter search term here" onChange={this.changeQuery}  required/>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-default" type="submit"> Submit </button>
                </div>
                <div className="col-md-2 col-md-offset-4">
                  <label className="radio-inline"><input type="radio" value="title" name="search_by" defaultChecked />Title</label>
                  <label className="radio-inline"><input type="radio" value="isbn" name="search_by" />ISBN</label>
                </div>
              </div>
            </form> : 
            null 
          }
            {
              this.state.mode == "Search Results" ?
              <div className="centre">
                <button onClick={() => this.setState({mode: "My Books", books: this.state.all_books})} className="btn btn-info">All books</button> 
              </div> :
              null
            }

            {
              this.state.req_mode == "mine" ?
                <button className="btn btn-primary" onClick={() => this.setState({req_mode: "others"})}> View Outgoing Requests</button> :
                <button className="btn btn-primary" onClick={() => this.setState({req_mode: "mine"})}> View Incoming Requests</button>
            }

        </div>
        
        
        {this.state.req_mode == "mine" ? 
        <div className="container">
          {
            (this.state.books.length > 0) ?
            this.state.books.map((item,i) => 
                <div key={i} className="col-md-2">
                  <img className="img-responsive img_result" src={this.state.books[i].cover ? this.isbn_to_cover(this.state.books[i].isbn) : this.state.no_img}
                       title={this.state.books[i].title}
                       onClick={() => this.directToBook(this.state.books[i]._id)}
                  />
                  <p>{this.formatTitle(this.state.books[i].title)} <span className="badge badge-danger">{this.count_reqs(this.state.books[i]._id)}</span></p>
                </div>)  :
            <p> Sorry. No results found. </p>
          }
        </div> :
        <div className="container">
          <ul className="list-group">
          {
            (this.state.from_reqs.length > 0) ?
            this.state.from_reqs.map((item,i) => 
                <li key={"my_reqs" + i} className="list-group-item">
                  {this.state.from_reqs[i].title} - {this.state.from_reqs[i].isbn} - {this.formatTime(this.state.from_reqs[i].time)} 
                  <button className="btn btn-danger ex" onClick={() => this.removeRequest(this.state.from_reqs[i]._id)}><span className="glyphicon glyphicon-remove" /></button>
                         <i className="centre">{this.formatMessage(this.state.from_reqs[i].message)}</i>
                </li>)  :
            <p> No outgoing requests! </p>
          }
          </ul>
        </div>
      }
        
      </div>
    );
  }
}