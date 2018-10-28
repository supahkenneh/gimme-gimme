import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './styles.css';
import { spawn } from 'child_process';

class Camera extends Component {
  constructor(props) {
    super(props)
    this.state = {
      photo: null,
      badImage: false
    }
  }

  handleCapture = e => {
    const file = e.target.files[0];
    this.setState({ photo: file })
  }

  submitPhoto = e => {
    e.preventDefault();
    if (this.state.photo) {
      const form = new FormData();
      form.append('photo', this.state.photo);
      form.append('prompt', this.props.prompt);
      form.append('player', this.props.user)

      axios.post(`/api/rooms/${this.props.roomId}/images`, form)
        .then(response => {
          if (response.data.success) {
            io().emit('WIN_ROUND', {
              roomID: this.props.roomId,
              userName: this.props.user
            })
          } else {
            this.setState({ badImage: true });
          }
        })
    }
  }

  render() {
    return (
      <div className="Camera">
        {
          this.state.badImage
            ? <span>Not what I wanted! Show me something else!</span>
            : null
        }
        <form>
          <input className="uploadFile"
            type='file'
            accept='image/*'
            capture
            onChange={this.handleCapture}
          />
          <br/>
          <button onClick={this.submitPhoto}>Submit</button>
        </form>
      </div>
    );
  }
}

export default Camera;
