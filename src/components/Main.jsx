const React = require('react')
const Preview = require('./Preview')
const Photos = require('./Photos')
import firebase, { auth, provider } from '../firebase'
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
      <div>
        <Preview user={this.state.user}/>
        <Photos user={this.state.user}/>
      </div> :
      <h4>Log in to use photo-loader</h4>
    let userInfo = this.state.user ?
      <h5>Signed in using {this.state.user.email}</h5> :
      null

    return (
      <div>
        <h3>{this.props.name}</h3>
        {userInfo}
        {authButton}
        {uploader}
      </div>
    )
  }
}
module.exports = Main
