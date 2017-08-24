import React from 'react';
import $ from 'jquery';
import Navbar from './Navbar';
import Alert from './Alert';


export default class Profile extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      pics: [],
      user: false,
      no_img: "https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg"
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

  render() {
    return (
      <div >

        <Navbar logged_in={this.state.user !== false} user={this.state.user}/> 
        
        <div className="page-header container">
            <h2 className="centre"> Recent Pictures </h2> 
        </div>
        
        
        <div className="container">
          {
            (this.state.pics.length > 0) ?
            this.state.pics.map((item,i) => 
                <div key={i} className="col-md-2">
                  
                </div>)  :
            <p> No recent pictures. Add one! </p>
          }
        </div>
        
      </div>
    );
  }
}