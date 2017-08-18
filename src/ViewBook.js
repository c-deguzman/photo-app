import React from 'react';
import $ from 'jquery';
import Alert from './Alert';

export default class ViewBook extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);

    this.state = {
      mounted: false,
      user: " ",
      no_img: "https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg",
      mode: "All Books",
      error_show: false
    }
  }
  
  componentDidMount() {

    var id = (new URL(document.location)).searchParams.get("id");
    
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
          url: "/get_book",
          contentType: 'application/json',
          data: JSON.stringify({id: id})
        }).done((data) => {

          this.setState({
            book: data,
            mounted: true,
            book_id: id
          }, () => 

            $.ajax({
              type: "POST",
              url: "/get_poster_info",
              contentType: 'application/json',
              data: JSON.stringify({user: data.user})
            }).done((data_poster) => {
              this.setState({
                poster_info: data_poster
              });
            })
          );
        })
      );
    });
    
  }
  
  handleRedirect(event, target){
    window.location.assign("/book?id=" + target);
  }


  isbn_to_cover(isbn){
    return ("https://covers.openlibrary.org/b/isbn/"+ isbn + "-L.jpg?default=false");
  }

  formatTitle(title){

    var limit = 20;

    if (title.length < limit){
      return title;
    }

    return (title.slice(0, limit - 3) + "...");
  }

  formatTime(unix){
    var a = new Date(unix * 1000);

    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();

    return "" + month + " " + date + ", " + year;

  }

  sendRequest(id){
    $.ajax({
      type: "POST",
      url: "/add_request",
      contentType: 'application/json',
      data: JSON.stringify({id: id})
    }).done((data) => {
      this.setState({
        result: data.result,
        error_show: true,
        error: data.error
      });
    });
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
              <li><a href="/Home">Home</a></li>
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
        { 
          this.state.mounted ?
            <h2 className="centre" id="book_title"> {this.state.book.title} </h2> :
            null
        }
        </div>
        
        {
          this.state.mounted ?
          <div>
            <div className="centre">
              <img className="img_result" src={this.state.book.cover ? this.isbn_to_cover(this.state.book.isbn) : this.state.no_img}
                   title={this.state.book.title}
              />
            </div>

            <div>
              <h3 className="centre">Posted by {this.state.book.user}&nbsp;{this.state.poster_info}</h3>
              <h4 className="centre">Added on {this.formatTime(this.state.book.time)}</h4>
              <h4 className="centre">ISBN: {this.state.book.isbn}</h4>
            </div>

            <Alert show={this.state.error_show} changeShow={() => this.setState({error_show: false})} result={this.state.result} error={this.state.error} success={"Request has been added. The poster has been notified."} /> :          
        

            <div className="centre">
              <button id="req" className="btn btn-info" onClick={() => this.sendRequest(this.state.book_id)}>Request Trade</button>
            </div>

            </div>:
          null
        }



        
        
      </div>
    );
  }
}