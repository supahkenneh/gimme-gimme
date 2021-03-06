import React, { Component, Fragment } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './styles.css';

class GameWinner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomID: null,
      winner: null,
      winningPhoto: null,
      redirect: false,
      players: null,
    }
    this.socket = null;
  }

  componentDidMount() {
    this.socket = io();
    const roomID = this.props.match.params.id;
    this.setState({ roomID: roomID })
    axios.get(`/api/rooms/${roomID}/results`)
      .then(response => {
        console.log(response.data);
        this.setState({
          winner: response.data.winner,
          winningPhoto: response.data.winningPhoto
        })
        if (response.data.players) {
          this.setState({ players: response.data.players })
        }
        return true;
      })
    this.socket.emit('END_ROUND', {
      roomID: roomID
    })
  }

  replay = e => {
    e.preventDefault();
    window.location.replace(`${window.location.origin}`)
  }

  render() {
    if (this.state.winner) {
      return (
        <div className="GameWinner">
          <div className="game-winner">
            Winner:
          </div>
          <div className="winner-name">
            {this.state.winner}
          </div>
          <div className="winning-photo">
            <img src={this.state.winningPhoto} alt="" />
          </div>
          <div className="thanks">Thanks For Playing!</div>
          <button onClick={this.replay}>Play Again</button>
        </div>
      );
    }
    return (
      <Fragment>
        <div id="no-winner-container">
          <div className="no-winner">No Winners Today, Try Again?</div>
          <button onClick={this.replay}>Play Again</button>
        </div>  
      </Fragment>
    )
  }
}

export default GameWinner;
