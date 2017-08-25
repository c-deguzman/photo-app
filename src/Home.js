import React from 'react';
import $ from 'jquery';
import Navbar from './Navbar';
import Alert from './Alert';
import Confirm from 'react-confirm-bootstrap';
import MasonryInfiniteScroller from 'react-masonry-infinite';
import update from 'immutability-helper';


export default class Profile extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.like_pic = this.like_pic.bind(this);
    this.unlike_pic = this.unlike_pic.bind(this);

    this.state = {
      pics: [],
      my_likes: [],
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

    $.ajax({
      type: "POST",
      url: "/get_pics",
      contentType: 'application/json'
    }).done((data_pics) => {
      this.setState({
        pics: data_pics
      })
    });

    $.ajax({
      type: "POST",
      url: "/get_likes",
      contentType: 'application/json'
    }).done((data_likes) => {
      this.setState({
        my_likes: data_likes
      })
    });
  }

  like_pic(index){
    $.ajax({
      type: "POST",
      url: "/like",
      contentType: 'application/json',
      data: JSON.stringify({id: this.state.pics[index]._id})
    }).done((data) => {

      if (data.result == "success"){
        var newState = update(this.state, {
                             pics: {
                                [index]: {
                                   likes: { $set: this.state.pics[index].likes + 1}
                                 }                                                      
                            }
                          });

        this.setState(newState);
        this.setState({
          my_likes: this.state.my_likes.concat([this.state.pics[index]._id])
        });
      }

    });
  }

  unlike_pic(index){
    $.ajax({
      type: "POST",
      url: "/unlike",
      contentType: 'application/json',
      data: JSON.stringify({id: this.state.pics[index]._id})
    }).done((data) => {

      if (data.result == "success"){
        var newState = update(this.state, {
                             pics: {
                                [index]: {
                                   likes: { $set: this.state.pics[index].likes - 1}
                                 }                                                      
                            }
                          });

        this.setState(newState);
        this.setState({
          my_likes: this.state.my_likes.filter((item) => (item != this.state.pics[index]._id))
        });
      }

    });
  }

  render() {
    return (
      <div >

        <Navbar logged_in={this.state.user !== false} user={this.state.user} curr="home"/> 
        
        <div className="page-header container">
            <h1 className="centre"> Recent Pictures </h1> 
        </div>

        { 
          this.state.user === false ? 
            <p className="centre"> <i className="em em-cry" /> You can't like photos while signed out <i className="em em-broken_heart" /></p> :
            null
        }
        
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
                      onError={(event) => {

                              var newState = update(this.state, {
                                                     pics: {
                                                        [i]: {
                                                           url: { $set: this.state.no_img}
                                                         }                                                      
                                                    }
                                                  });

                              this.setState(newState);
                              }
                            } 
                      height={this.state.pics[i].height}
                      />
                      
                    <p className={"centre" + (this.state.pics[i].desc != "" ? " desc" : "")}>{this.state.pics[i].desc}</p>
                    <div className="post_info">
                      <i className="em em-bust_in_silhouette" />
                      { (this.state.user !== false) ?
                          (this.state.my_likes.indexOf(this.state.pics[i]._id) == -1) ?
                            <p className="right"> 
                              <i className="em em-heart" onClick={() => this.like_pic(i)}/> {this.state.pics[i].likes} 
                            </p> :
                            <p className="right"> 
                              <i className="em em-sparkling_heart" onClick={() => this.unlike_pic(i)}/> {this.state.pics[i].likes} 
                            </p> :
                          <p className="right"> 
                            <i className="em em-heart"/> {this.state.pics[i].likes} 
                          </p> 
                      }
                      </div>
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