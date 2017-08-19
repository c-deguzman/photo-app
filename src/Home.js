import React from 'react';
import $ from 'jquery';

export default class HomePage extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.get_city = this.get_city.bind(this);
    this.get_prov = this.get_prov.bind(this);
    
    this.state = {
      all_books: [],
      books: [],
      user: " ",
      no_img: "https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg",
      mode: "All Books"
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
            all_books: data.books,
            books: data.books
          }, () => {
            this.get_city();
            this.get_prov();
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

    var lim_prov = event.target.prov.checked;
    var lim_city = event.target.city.checked;
    var lim_mine = event.target["!mine"].checked;

    var book_results = [];

    if (mode == "isbn"){
      book_results = this.state.all_books.filter((item) => (item.isbn == lookup));
    } else if (mode == "title"){
      book_results = this.state.all_books.filter((item) => (item.title.toLowerCase().indexOf(lookup.toLowerCase()) != -1));
    }

    if (lim_prov){
      book_results = book_results.filter((item) => (this.state.prov_users.indexOf(item.user) != -1));
    }

    if (lim_city){
      book_results = book_results.filter((item) => (this.state.city_users.indexOf(item.user) != -1));
    }

    if (lim_mine){
      book_results = book_results.filter((item) => (item.user != this.state.user));
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

    var limit = 20;

    if (title.length < limit){
      return title;
    }

    return (title.slice(0, limit - 3) + "...");
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
              <li className="active"><a href="/home">Home</a></li>
              <li><a href="/add_book">Add Book</a></li>
              <li><a href="/my_books">My Requests</a></li>
            </ul> 
             
            <p className="navbar-text"> Signed in as {this.state.user} </p> 
           
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/user_settings"><span className="glyphicon glyphicon-cog" /> Profile </a></li>
              <li><a href="/logout"><span className="glyphicon glyphicon-log-out" /> Logout </a></li>
            </ul> 
          </div>
        </nav>

        <div className="page-header container">
            <h2 className="centre"> {this.state.mode} </h2> 

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
                <div className="col-md-8 col-md-offset-1">
                  <div className="col-md-3">
                    <p className="text-right"> Limit search: </p>
                  </div>

                  <div className="col-md-6">
                    <label className="checkbox-inline"><input type="checkbox" value="" name="prov" />My Province</label>
                    <label className="checkbox-inline"><input type="checkbox" value="" name="city" />My City</label>
                    <label className="checkbox-inline"><input type="checkbox" value="" name="!mine" />Not Mine</label>
                  </div>
                </div>
              </div>
            </form>
            {
              this.state.mode == "Search Results" ?
              <div className="centre">
                <button onClick={() => this.setState({mode: "All Books", books: this.state.all_books})} className="btn btn-info">All books</button> 
              </div> :
              null
            }
        </div>
        
        
        <div className="container">
          {
            (this.state.books.length > 0) ?
            this.state.books.map((item,i) => 
                <div key={i} className="col-md-2">
                  <img className="img-responsive img_result" src={this.state.books[i].cover ? this.isbn_to_cover(this.state.books[i].isbn) : this.state.no_img}
                       title={this.state.books[i].title}
                       onClick={() => this.directToBook(this.state.books[i]._id)}
                  />
                  <p>{this.formatTitle(this.state.books[i].title)}</p>
                </div>)  :
            <p> Sorry. No results found. </p>
          }
        </div>
        
      </div>
    );
  }
}