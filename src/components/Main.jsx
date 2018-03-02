const React = require('react')
const Preview = require('./Preview')
const Folder = require('./Folder')
import firebase, { auth, provider } from '../firebase'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'

class Main extends React.Component {

  state = {
    user: null,
    avatar: null
  }

  login = () => { auth.signInWithPopup(provider) }
  logout = () => { auth.signOut()}

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      user ?
      this.setState({
        user,
        avatar: user.photoURL
      })
      : this.setState({user})
    })
  }

  render() {
    const styles = {
      button: {
        margin: 6
      },
      bar: {
        marginBottom: 24
      },
      pic: {
        margin: 6,
        float: 'right'
      }
    }

    let authButton = this.state.user ?
      <div>
        <RaisedButton onClick={this.logout}
          style={styles.button}
          label="Log Out"></RaisedButton>
        <Avatar src={this.state.avatar} style={styles.pic}/>
      </div>
       :
      <RaisedButton onClick={this.login}
        style={styles.button}
        label="log in"></RaisedButton>

    let app = this.state.user ?
      <div>
        <Folder user={this.state.user}/>
      </div> :
      <h4>Log in to use photo-loader</h4>

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={this.props.name}
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
