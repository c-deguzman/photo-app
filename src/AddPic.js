import React from 'react';
import $ from 'jquery';
import Alert from './Alert';
import Confirm from 'react-confirm-bootstrap';
import Navbar from './Navbar';

export default class AddPic extends React.Component {

    constructor(props){
      super(props);
      this.render = this.render.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.onConfirm = this.onConfirm.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.changeDesc = this.changeDesc.bind(this);
      this.onChange = this.onChange.bind(this);
      this._onLoad = this._onLoad.bind(this);

      
      this.state = {
        user: "",
        show_warning: false,
        pic_url: "",
        pic_desc: "",
        no_img: "https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg",
        error_show: false,
        pic_h: 200
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
        });
      });
    }

  	handleSubmit(event){
      event.preventDefault();
      
    }

    onConfirm(){
    	$.ajax({
          type: "POST",
          url: "/add_pic",
          contentType: 'application/json',
          data: JSON.stringify({
    			 url: this.state.pic_url,
    			 desc: this.state.pic_desc,
           height: this.state.pic_h
    		  })
        }).done((data) => {
        	this.setState({
        		result: data.result,
        		error_show: true,
        		error: data.error
        	}, () => {
            if (this.state.result == "success"){
              this.setState({
                pic_url: "", 
                pic_desc: "",
                pic_h: 200
              })
            }
          })
        })
    }

    onChange(event){
    	this.setState({
    		pic_url: event.target.value,
    		visible: (event.target.value.length > 0)
    	})
    }

    changeDesc(event){
    	this.setState({
    		pic_desc: event.target.value
    	});
    }

    _onLoad(event){
      this.setState({
        pic_h: event.target.height
      });
    }


    render() {
      
      return (
        
        <div>
        <Navbar logged_in={this.state.user !== false} user={this.state.user} curr="add_pic"/> 

        <Alert show={this.state.error_show} changeShow={() => this.setState({error_show: false})} result={this.state.result} error={this.state.error} success={"Your photo has been added! Check on it at 'Home'"} /> :          
          <div className="page-header">
            <h1 id="title">Add Photo</h1>
          </div>
          
          <div className="container">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="pic">Photo URL*:</label>
              <div className="col-md-8">
                <input type="text" className="form-control" id="pic" name="pic" placeholder="Enter Photo URL" value={this.state.pic_url} onChange={this.onChange} required/>
              </div>
            </div>

            <div className="form-group"> 
              <div className="col-md-12 col-md-offset-5">
              	{ this.state.visible ?
              		<Confirm
	                	onConfirm={this.onConfirm}
	                	body={
                      <div>
								        <div className="centre">
                  				<img src={this.state.pic_url} 
                  					id="preview_pic"
                  					ref={img => this.img = img}
                  					onError={() => {
                  									this.img.src = this.state.no_img;

                                    this.setState({
                                      pic_h: 200
                                    });
                  									}
                  								} 
                            onLoad={this._onLoad}
                  					/>
                          </div>
                      
	                				<form className="form-horizontal" onSubmit={this.handleSubmit}>
							            <div className="form-group">
							              <label className="control-label col-md-2" htmlFor="desc"> Caption:</label>
							              <div className="col-md-8">
							                <input type="text" className="form-control" id="desc" name="desc" placeholder={this.state.pic_desc} onChange={this.changeDesc} />
							              </div>
							            </div>
						            </form>
	                		</div>}
	                	confirmText="Confirm"
	                	title="Photo Verification"
	                	confirmBSStyle="success">
	                	<button type="submit" className="btn btn-default"> Add Photo &nbsp; <span className="glyphicon glyphicon-send"/></button>
	            	</Confirm> : 
	            	<button type="submit" className="btn btn-default disabled"> Add Photo &nbsp; <span className="glyphicon glyphicon-send"/></button>
              	}

              	
              </div>
            </div>
          </form>
            
          <div className="centre">
            <p id="explain"> *We currently don't have the capacity to host images, only linking <i className="em em-disappointed" /> You're going to need to provide a link. <br/>
             Links starting with HTTPS usually work best for our site. But try your luck! <i className="em em-four_leaf_clover"/></p>
          </div>
        </div>
      </div>
    );
  }
}