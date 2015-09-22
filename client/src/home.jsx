var React       = require('react'),
    ReactRouter = require('react-router');
// var url = 'http://0.0.0.0:3000/';

var Rooms = require('./rooms');

var Home = React.createClass({
  mixins: [ReactRouter.Navigation],

  getInitialState: function() {
    return {
      loggedIn: false,
      roomname: '',
      email: '',
      password: '',
      url: 'signin',
      button: 'Create an Account',
      emailStore: '',
      verificationSent: false,
      rooms: [],
      token: ''
    };
  },

  handleRoomnameTextChange: function (event) {
    this.setState({
      roomname: event.target.value
    })
  },

  handlePasswordTextChange: function (event){
    this.setState({
      password: event.target.value
    })
  },

  handleEmailTextChange: function (event) {
    this.setState({
      email: event.target.value
    })
  },

  enterPressed: function (event) {
    if(event.keyCode === 13 && this.state.loggedIn) {
      this.submitRoom(event);
    }

    if(event.keyCode === 13 && !this.state.loggedIn) {
      this.submitAuth(event);
    }
  },

  goToRoom: function (id) {
    this.transitionTo('room', {id: id});
  },

  submitRoom: function(event){
    var context = this;
    event.preventDefault();
    $.ajax({ // Post message
      type: 'POST',
      url: '/create',
      contentType: 'application/json',
      data: JSON.stringify({
        roomname: this.state.roomname,
        email: this.state.emailStore
      }),
      success: function(data){
        console.log('server response:', data);
        if (data.success) {
          context.transitionTo('room', {id: data.id});
        }
      }
    });
    this.setState({ roomname: '' }); // Clear input box
    console.log('create:', this.state);
    console.log(this.state.url);
  },

  CreateRoom: function() { 
    return (
      <div>
        <div className="input-group" style = {{padding: '15px', marginTop: '100px'}}>
          <h1>Create a Room</h1>
          <input value={this.state.roomname} onChange={this.handleRoomnameTextChange} onKeyDown={this.enterPressed} type="text" className="form-control"  placeholder="Enter your room's name" />
          <span className="input-group-btn" >
            <button onClick={this.submitRoom} className="btn btn-success" type="button"> Submit </button>
          </span>      
        </div>
        <Rooms rooms={this.state.rooms} goTo={this.goToRoom} token={this.state.token} />
      </div>
    )
  },

  submitAuth: function(event){
    event.preventDefault();
    var context = this;
    $.ajax({ // Post message
      type: 'POST',
      url: '/' + this.state.url,
      contentType: 'application/json',
      data: JSON.stringify({ email: this.state.email, password: this.state.password }),
      success: function (data){
        if (data.signedIn) {
          context.setState({
            loggedIn: true,
            emailStore: context.state.email,
            rooms: data.rooms,
            token: data.token
          })
        } else if (data.emailSent) {
          context.setState({
            verificationSent: true,
            url: 'signin',
            button: 'Create an Account'
          })
        }
      }
    });
    console.log(this.state);
  },

  toggleAuth: function(event){
    event.preventDefault();
    if(this.state.url==="signin") {
      this.setState({
        button: "Already Have An Account?",
        url: "signup"
      });
    } else {
      this.setState({
        button: "Create an Account",
        url: "signin"
      });
    }
  },

  Auth: function(){
    return (
      <div className="input-group" style={{ padding: '15px', marginTop: '100px' }} >
        <h1>{this.state.url}</h1>
        { this.state.verificationSent ? <p>We sent you an e-mail. Go and click on the link to verify.</p> : null }
        <input value={this.state.email} onChange={this.handleEmailTextChange} onKeyDown={this.enterPressed} type="text" className="form-control"  placeholder="Enter e-mail address" />
        <input style={{marginTop: "10px" }} value={this.state.password} onChange={this.handlePasswordTextChange} onKeyDown={this.enterPressed} type="password" className="form-control"  placeholder="Enter password" />
        <div style={{color:"white"}}> t</div>
        <div className="input-group-btn" style={{display: "block"}}>
          <button onClick={this.submitAuth} className="btn btn-success" type="button"> Submit </button>
          <input type="button" onClick={this.toggleAuth} className="btn btn-success" value={this.state.button} />
        </div>   
      </div>
    )
  },

  render: function(){
    return (
      <div>
        { !this.state.loggedIn ? this.Auth() : null }
        { this.state.loggedIn ? this.CreateRoom() : null }
      </div>
    )
  }
});

module.exports = Home;

// var element = React.createElement(HOM);
// React.render(element, document.querySelector('.container'));