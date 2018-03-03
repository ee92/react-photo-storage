const React = require('react')
const Preview = require('./Preview')
const Folder = require('./Folder')
import firebase, { auth, provider } from '../firebase'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import FlatButton from 'material-ui/FlatButton'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import {blueGrey500} from 'material-ui/styles/colors'

class Main extends React.Component {

  state = {
    user: null,
    avatar: null
  }

  login = () => { auth.signInWithPopup(provider) }
  logout = () => { auth.signOut()}

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      let avatar = user ? user.photoURL : null
      this.setState({
        user,
        avatar
      })
    })
  }

  render() {
    const styles = {
      button: {
        margin: 6,
        color: 'white'
      },
      bar: {
        marginBottom: 24,
        backgroundColor: blueGrey500
      },
      pic: {
        margin: 6,
        float: 'right'
      }
    }

    let authButton = this.state.user ?
      <div>
        <FlatButton onClick={this.logout}
          style={styles.button}
          label="Log Out"></FlatButton>
        <Avatar src={this.state.avatar} style={styles.pic}/>
      </div>
       :
      <FlatButton onClick={this.login}
        style={styles.button}
        label="log in"></FlatButton>

    let app = this.state.user ?
      <div>
        <Folder user={this.state.user} getFolder={this.getFolder}/>
      </div> :
      <h4>Log in to use photo-loader</h4>

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title='Photo Loader'
            showMenuIconButton={false}
            iconElementRight={authButton}
            style={styles.bar}
          />
          {app}
        </div>
      </MuiThemeProvider>
    )
  }
}
module.exports = Main
