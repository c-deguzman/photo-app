import React from 'react';
import $ from 'jquery';
import Alert from './Alert';
import Confirm from 'react-confirm-bootstrap';

export default class ViewBook extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.changeMessage = this.changeMessage.bind(this);
    this.confirmOption = this.confirmOption.bind(this);
    this.rejectOption = this.rejectOption.bind(this);

    this.state = {
      mounted: false,
      user: " ",
      no_img: "https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg",
      mode: "All Books",
      error_show: false,
      message: "",
      my_book: false,
      reqs: [],
      curr_hover: "",
      valid_book: false,
      valid_id_called: false
    }
  }

  get_reqs(){
    var id = (new URL(document.location)).searchParams.get("id");

    $.ajax({
      type: "POST",
      url: "/get_book_reqs",
      contentType: 'application/json',
      data: JSON.stringify({id: id})
    }).done((reqs_data) => {     
      this.setState({
        reqs: reqs_data
      });
    });
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
          url: "/valid_id",
          contentType: 'application/json',
          data: JSON.stringify({id: id})
        }).done((data) => {
          this.setState({
            valid_book: data,
            valid_id_called: true
          }, () =>

          {
            if (this.state.valid_book){
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
                      poster_info: data_poster,
                      my_book: (data.user == data_user)
                    }, () =>
                    {
                      if (this.state.my_book){
                        this.get_reqs();
                      }
                    });
                  })
                );
              })
            }
          }

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

    var hours = a.getHours();
    var minutes = a.getMinutes();

    return "" + month + " " + date + ", " + year + " @ " + (hours <= 9 ? "0" : "") +  hours + ":" + (minutes <= 9 ? "0" : "") + minutes;

  }


  formatMessage(msg){
    if (msg != ""){
      return "\"" + msg +  "\"";
    }

    return "User did not send a personalized message.";
  }

  sendRequest(id){
    $.ajax({
      type: "POST",
      url: "/add_request",
      contentType: 'application/json',
      data: JSON.stringify({id: id, message: this.state.message})
    }).done((data) => {
      this.setState({
        result: data.result,
        error_show: true,
        error: data.error,
        message: ""
      });
    });
  }
  

  changeMessage(event){
    this.setState({
      message: event.target.value
    })
  }

  handleSubmit(event){
    event.preventDefault();
  }

  confirmOption(){
    var id = (new URL(document.location)).searchParams.get("id");

    $.ajax({
      type: "POST",
      url: "/ac_request",
      contentType: 'application/json',
      data: JSON.stringify({id: id})
    }).done((data) => {
      if (data.result == "success"){
        window.location.href = "/my_books"
      }
    });
  }

  rejectOption(id){
    $.ajax({
      type: "POST",
      url: "/reject",
      contentType: 'application/json',
      data: JSON.stringify({id: id})
    }).done((data) => {
      if (data.result == "success"){
        this.get_reqs();
      }
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
              <li><a href="/home">Home</a></li>
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

        
        <div className="page-header">
        { 
          this.state.mounted ?
            <h2 className="centre" id="book_title"> {this.state.book.title} </h2> :
            null
        }
        </div>
        
        {
          (this.state.mounted && this.state.valid_book) ?
          
          <div>
            <div className="centre">
              <img className="img_result" src={this.state.book.cover ? this.isbn_to_cover(this.state.book.isbn) : this.state.no_img}
                   title={this.state.book.title}
              />
            </div>

            <div>
              { this.state.my_book ?
                <h3 className="centre">You posted this book.</h3> :
                <h3 className="centre">Posted by {this.state.book.user}&nbsp;{this.state.poster_info}</h3>
              }
              <h4 className="centre">Added on {this.formatTime(this.state.book.time)}</h4>
              <h4 className="centre">ISBN: {this.state.book.isbn}</h4>
            </div>

            { this.state.my_book == false ?

            <div>
            <Alert show={this.state.error_show} changeShow={() => this.setState({error_show: false})} result={this.state.result} error={this.state.error} success={"Request has been added. The poster has been notified."} /> :          
        
            <div className="centre">
              <Confirm
                    onConfirm={() => this.sendRequest(this.state.book_id)}
                    body={
                      <div className="form-group">  
                        <label className="control-label" htmlFor="msg">Trade Request Message:</label>
                        <textarea type="text" className="form-control" id="msg" name="msg" placeholder="Enter trade request message. Please include contact information." onChange={this.changeMessage} />   
                      </div>
                      }
                    confirmText="Request"
                    title="Request Confirmation"
                    confirmBSStyle="success">
                    <button id="req" className="btn btn-info"> Request Trade &nbsp; <span className="glyphicon glyphicon-send"/></button>
                </Confirm> 
                </div> 
            </div> :
            <div>
              <div className="centre">
                <Confirm
                  onConfirm={this.confirmOption}
                  body={
                    <ul>
                      <li><h4>Accepting this option will immediately remove your book listing.</h4></li>
                      <li><h4>All requests for your book will also be removed.</h4></li>
                    </ul>
                    }
                  confirmText="Delete Book"
                  title="Delete Confirmation"
                  confirmBSStyle="danger">
                  <button className="btn btn-danger">Delete &nbsp; <span className="glyphicon glyphicon-trash"/></button>
                </Confirm> 
              </div>
              <h4 className="centre"> Accepting any option will remove your book listing. You are responsible for arranging the exchange with the requester. </h4>
              <div className="container">
                <ul className="list-group">
                  {this.state.reqs.map(
                    (item, i) => 
                    <li key={"list_" + i} className={"list-group-item"}>
                        Requested by {this.state.reqs[i].from} - {this.formatTime(this.state.reqs[i].time)} 
                        <Confirm
                            onConfirm={this.confirmOption}
                            body={
                              <ul>
                                <li><h4>Accepting this option will immediately remove your book listing.</h4></li>
                                <li><h4>All requests for your book will also be removed.</h4></li>
                                <li><h4>You are responsible for arranging the exchange with the requester.</h4></li>
                                <li><h3>At this point you should have the requester's information saved.</h3></li>
                              </ul>
                              }
                            confirmText="Accept Request"
                            title="Request Confirmation"
                            confirmBSStyle="success">
                            <button className="btn btn-success check"><span className="glyphicon glyphicon-ok" /></button>
                        </Confirm> 

                        <button className="btn btn-danger ex" onClick={() => this.rejectOption(this.state.reqs[i]._id)}><span className="glyphicon glyphicon-remove" /></button>
                         <i className="centre">{this.formatMessage(this.state.reqs[i].message)}</i></li>
                    )}
                </ul>
              </div>
            </div>

              }
              
            </div> :

          (this.state.valid_id_called  && this.state.valid_book == false) ?
            <h1 className="centre">Book ID not found.</h1> :
            null
        }
        
      </div>
    );
  }
}