const React = require('react')
import firebase, { auth, provider, storage } from '../firebase'

class Preview extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: this.props.user,
      file: null,
      url: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.writeUserData = this.writeUserData.bind(this)
  }

  handleChange(e) {
    this.setState({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0])
    });
  }

  writeUserData() {
    console.log(storage.ref().child('user'))
    storage.ref().child('users/' + this.props.user.uid).put(this.state.file).then((snap) => {
      console.log('stored')
    });
  }

  render() {
    const imgStyle = {
      maxHeight: "100px",
      maxWidth: "100px"
    }

    return (
      <div>
        <input type="file" onChange={this.handleChange}/>
        <img src={this.state.url} style={imgStyle}/>
        <button onClick={this.writeUserData}>submit</button>
      </div>
    );
  }
}
module.exports = Preview
