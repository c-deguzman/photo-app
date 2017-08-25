import React from 'react';
import $ from 'jquery';
import Navbar from './Navbar';
import Alert from './Alert';
import Confirm from 'react-confirm-bootstrap';
import MasonryInfiniteScroller from 'react-masonry-infinite';


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
      }, () => {

        $.ajax({
          type: "POST",
          url: "/get_pics",
          contentType: 'application/json'
        }).done((data_pics) => {
          this.setState({
            pics: data_pics
          })
        });

      });
    });
  }

  render() {
    return (
      <div >

        <Navbar logged_in={this.state.user !== false} user={this.state.user} curr="home"/> 
        
        <div className="page-header container">
            <h2 className="centre"> Recent Pictures </h2> 
        </div>
        
        <div className="centre">
        {
          (this.state.pics.length > 0) ?
          <MasonryInfiniteScroller 
              className="masonry"
              hasMore={false} 
              loadMore={() => this.setState({ elements: this.state.elements.push("Element") })}
              sizes={[
                { columns: 1, gutter: 20 },
                { mq: '560px', columns: 2, gutter: 20 },
                { mq: '800px', columns: 3, gutter: 20 },
                { mq: '1050px', columns: 4, gutter: 20 },
                { mq: '1400px', columns: 5, gutter: 20 }
                ]}
              >
            {
                this.state.pics.map((item,i) => 
                  <div key={i} className="card centre">
                    <div>
                    <img src={this.state.pics[i].url} 
                      id="preview_pic"
                      ref={img => this.img = img}
                      onError={() => {
                              this.img.src = this.state.no_img;
                              }
                            } 
                      />
                      
                    <p className="centre">{this.state.pics[i].desc}</p>
                    </div>
                  </div>)
            }
        </MasonryInfiniteScroller> :
          <div className="centre">
            <p> No recent pictures. Add one! <i className="em em-smiley_cat"/></p>
          </div>
        }
        </div>
      
        
        
      </div>
    );
  }
}