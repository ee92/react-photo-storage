const React = require('react')
const Preview = require('./Preview')
const Folder = require('./Folder')
import firebase, { auth, provider } from '../firebase'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {deepOrange500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton'

class Main extends React.Component {

  state = {
    user: null
  }

  login = () => { auth.signInWithPopup(provider) }
  logout = () => { auth.signOut()}

  componentDidMount() {
    auth.onAuthStateChanged((user) => { this.setState({user}) })
  }

  render() {
    const styles = {
      button: {
        margin: 12
      }
    }

    let authButton = this.state.user ?
      <RaisedButton onClick={this.logout}
        style={styles.button}
        label="Log Out"></RaisedButton> :
      <RaisedButton onClick={this.login}
        style={styles.button}
        label="log in"></RaisedButton>
    let app = this.state.user ?
      <div>
        <Folder user={this.state.user}/>
      </div> :
      <h4>Log in to use photo-loader</h4>
    let userInfo = this.state.user ?
      <h5>Signed in using {this.state.user.email}</h5> :
      null

    const muiTheme = getMuiTheme({
      palette: {
        primary1Color: deepOrange500,
        accent1Color: deepOrange500
      }
    })

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <h3>{this.props.name}</h3>
          {userInfo}
          {authButton}
          {app}
        </div>
      </MuiThemeProvider>
    )
  }
}
module.exports = Main
