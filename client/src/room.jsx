var React = require('react'),
    ReactRouter = require('react-router');


var Room = React.createClass({

  handleClick: function () {
    window.localStorage['murmur.mod.' + this.props.id] = this.props.token;
    this.props.goTo(this.props.id);
  },

  render: function () {
    return (
      <div className="linksBox" >
        <a onClick={this.handleClick} >{ this.props.name }</a>
      </div>
    )
  }
});

module.exports = Room;
