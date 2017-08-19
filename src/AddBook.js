import React from 'react';
import $ from 'jquery';
import Alert from './Alert';
import Confirm from 'react-confirm-bootstrap';

export default class AddBook extends React.Component {

    constructor(props){
      super(props);
      this.render = this.render.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.onConfirm = this.onConfirm.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.onChange = this.onChange.bind(this);
      this.findBookInfo = this.findBookInfo.bind(this);
      this.changeTitle = this.changeTitle.bind(this);
      this.googleBooks = this.googleBooks.bind(this);
      
      this.state = {
        user: "",
        show_warning: false,
        isbn: "",
        no_img: "https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg",
        error_show: false
      }
    }
  

    componentDidMount() {  
	    var request_user = $.ajax({
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

  	handleSubmit(event){
      event.preventDefault();
      
    }

    onConfirm(){
    	$.ajax({
          type: "POST",
          url: "/add_book",
          contentType: 'application/json',
          data: JSON.stringify({
    			cover: this.state.cover,
    			title: this.state.book_title,
    			isbn: this.state.isbn
    		})
        }).done((data) => {
        	this.setState({
        		result: data.result,
        		error_show: true,
        		error: data.error
        	})
        })
    }

    onChange(event){
    	this.setState({
    		isbn: event.target.value,
    		visible: false
    	})
    }

    changeTitle(event){
    	this.setState({
    		book_title: event.target.value
    	});
    }

    findBookInfo(){
    	var url = "http://openlibrary.org/search.json?isbn=" + this.state.isbn;

    	var request_isbn = $.ajax({
	      type: "GET",
	      url: url,
	    }).done((book_data) => {

	    	book_data = JSON.parse(book_data);

	    	if (book_data.num_found > 0){
	    		this.setState({
	    	  		book_img_url: "https://covers.openlibrary.org/b/isbn/"+ this.state.isbn + "-M.jpg?default=false",
	    	  		book_title: book_data.docs[0].title,
	    	  		cover: true,
	    	  		visible: true
	    	  	})
	    	} else {
	    		this.setState({
	    	  		book_img_url: "https://covers.openlibrary.org/b/isbn/"+ this.state.isbn + "-M.jpg?default=false",
	    	  		book_title: "Book title not found",
	    	  		cover: true,
	    	  		visible: true
	    	  	})
	    	} 
  	    });
    }

    googleBooks(){
      var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + this.state.isbn;

      var request_isbn = $.ajax({
        type: "GET",
        url: url,
      }).done((book_data) => {

        console.log(book_data);

        });
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
              <li><a href="/home">Home</a></li>
              <li className="active"><a href="/add_book">Add Book</a></li>
              <li><a href="/my_books">My Requests</a></li>
            </ul> 
             
            <p className="navbar-text"> Signed in as {this.state.user} </p> 
           
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/user_settings"><span className="glyphicon glyphicon-cog" /> Profile </a></li>
              <li><a href="/logout"><span className="glyphicon glyphicon-log-out" /> Logout </a></li>
            </ul> 
          </div>
        </nav>

        {/*
        <button className="btn btn-default" onClick={this.googleBooks} >Google Books </button>
      */}

        <Alert show={this.state.error_show} changeShow={() => this.setState({error_show: false})} result={this.state.result} error={this.state.error} success={"Book added successfully! Check on it and recieve notifications for it in 'My Requests.'"} /> :          
          <div className="page-header">
            <h1 id="title">Add Book</h1>
          </div>
          
          <div className="container">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="control-label col-md-4" htmlFor="isbn">International Standard Book Number:</label>
              <div className="col-md-6">
                <input type="text" className="form-control" id="isbn" name="isbn" placeholder="Enter ISBN" onChange={this.onChange} pattern="[0-9]{10}([0-9]{3})?" required/>
              </div>
            </div>

            <div className="form-group"> 
              <div className="col-md-12 col-md-offset-4">
              	{(this.state.isbn.length == 10 || this.state.isbn.length == 13) ?
              		this.state.visible ?
              		<Confirm
              			visible={true}
	                	onConfirm={this.onConfirm}
	                	body={<div className="centre">
								<div>
	                				<img src={this.state.book_img_url} 
	                					width={200} 
	                					height={300} 
	                					id="preview_book"
	                					ref={img => this.img = img}
	                					onError={() => {
	                									this.img.src = this.state.no_img;
	                									this.setState({
	                										cover: false
	                									});
	                									}
	                								} 
	                					/>
	                				<p> ISBN: &nbsp; {this.state.isbn} </p>
	                				<form className="form-horizontal" onSubmit={this.handleSubmit}>
							            <div className="form-group">
							              <label className="control-label col-md-2" htmlFor="book_title">Title:</label>
							              <div className="col-md-8">
							                <input type="text" className="form-control" id="book_title" name="book_title" placeholder={this.state.book_title} onChange={this.changeTitle} />
							              </div>
							            </div>
						            </form>
	                			</div>
	                		</div>}
	                	confirmText="Confirm"
	                	title="Book Verification"
	                	confirmBSStyle="success">
	                	<button type="submit" className="btn btn-default"> Submit &nbsp; <span className="glyphicon glyphicon-send"/></button>
	            	</Confirm> : 
	            	<button type="submit" className="btn btn-default" onClick={this.findBookInfo}> Submit &nbsp; <span className="glyphicon glyphicon-send"/></button> :
	            	<button type="submit" className="btn btn-default disabled"> Submit &nbsp; <span className="glyphicon glyphicon-send"/></button>
              	}

              	
              </div>
            </div>
          </form>
            
          <div className="col-md-8 col-md-offset-2">
            <p id="explain"> The ISBN is always found on the back cover, near the bar code. It will also be listed inside the book, on the same page as the copyright and publisher information. An ISBN will be 10 or 13 digits. This is a globally recognized <u>unique</u> identifier for books.</p>
            </div>
        </div>
      </div>
    );
  }
}