const React = require('react')
const Preview = require('./Preview')
import firebase, { auth, provider, storage } from '../firebase'

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
    this.login = () => { auth.signInWithPopup(provider) }
    this.logout = () => { auth.signOut()}
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => { this.setState({user}) })
  }

  render() {
    let authButton = this.state.user ?
      <button onClick={this.logout}>Log Out</button> :
      <button onClick={this.login}>Log In</button>

    let uploader = this.state.user ?
      <Preview user={this.state.user}/> :
      <h4>Log in to use photo-loader</h4>

    let userInfo = this.state.user ?
      <h5>Signed in using {this.state.user.email}</h5> :
      null

    return (
      <div>
        {userInfo}
        {authButton}
        {uploader}
      </div>
    )
  }
}
module.exports = Main
