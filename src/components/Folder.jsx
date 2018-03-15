const React = require('react')
const Preview = require('./Preview')
const Contents = require('./Contents')
import firebase, { storage, database } from '../firebase'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import {Card, CardMedia, CardTitle} from 'material-ui/Card'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Back from 'material-ui/svg-icons/navigation/arrow-back'
import NewFolder from 'material-ui/svg-icons/file/create-new-folder'
import TextField from 'material-ui/TextField'
import Add from 'material-ui/svg-icons/content/add'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import {blue500, grey600} from 'material-ui/styles/colors'


class Folder extends React.Component {

  state = {
    user: this.props.user,
    open: false,
    parent: "",
    files: []
  }

  openInput = (e) => {
    this.setState({
      open: true,
      anchor: e.currentTarget
    })
  }

  closeInput = () => { this.setState({ open: false }) }

  deleteFile = (key, folder) => {
    if (folder == false) {
      storage.ref(this.props.user.uid).child(key).delete()
    }
    database.ref(this.props.user.uid).child(key).remove()
  }

  createFolder = () => {
    if (this.refs.folder.input.value == "") {return this.folderInput()}
    let key = database.ref(this.props.user.uid).push().key
    database.ref(this.props.user.uid).child(key).set({
      "folder" : true,
      "name" : this.refs.folder.input.value,
      "parent" : this.state.parent,
      "key" : key
    })
    this.closeInput()
  }

  openFolder = (parent) => {
    this.setState({
      parent: parent,
      files: []
    }, () => {
      this.handleChange()
    })
  }

  goBack = () => {
    if (this.state.parent) {
      database.ref(this.props.user.uid + "/" + this.state.parent).once('value', (snap) => {
        this.setState({
          parent: snap.val().parent,
          files: [],
        }, () => {
          this.handleChange()
        })
      })
    }
  }

  handleChange = () => {
    this.ref && this.ref.off()
    this.query && this.query.off()

    this.ref = database.ref(this.props.user.uid)
    this.query = this.ref.orderByChild('parent').equalTo(this.state.parent)

    this.query.on('child_added', (child) => {
      let f = {
        folder: child.val().folder,
        key: child.key,
        url: child.val().url,
        name: child.val().name,
        parent: child.val().parent
      }
      this.setState((state) => {
        let files = state.files.slice()
        files.push(f)
        return {files}
      })
    })

    this.ref.on('child_removed', (child) => {
      if (child.val().folder) {
        database.ref(this.props.user.uid).orderByChild('parent').equalTo(child.key).on("value", (snap) => {
          snap.forEach((snap) => {
            snap.ref.remove()
          })
        })
      } else {
        storage.ref(this.props.user.uid).child(child.key).delete()
      }

      let files = this.state.files.filter((file) => {
        return file.key != child.key
      })
      this.setState({files})
    })

    this.query.on('child_changed', (child) => {
      let files = this.state.files.filter((file) => {
        return file.key != child.key
      })
      files.push({
        folder: child.val().folder,
        key: child.key,
        url: child.val().url,
        name: child.val().name,
        parent: child.val().parent
      })
      this.setState({files})
    })
  }

  componentDidMount() {
    this.handleChange()
  }

  render() {

    const styles = {
      button: {
        margin: 12
      },
      card: {
        display: 'inline-block',
        padding: 12,
        margin: 12
      },
      noFiles: {
        textAlign: 'center',
        margin: 'auto',
        maxWidth: '30%'
      },
      large: {
        transform: 'scale(3.5)'
      },
      input: {
        color: grey600
      },
      back: {
        position: 'fixed',
        bottom: '0px',
        float: 'left',
        zIndex: 1
      }
    }

    let files = (this.state.files.length == 0) ?
      <Card style={styles.noFiles}>
        <CardTitle subtitle="no files here"/>
      </Card> :
      <Contents files={this.state.files}
        user={this.props.user}
        parent={this.state.parent}
        deleteFile={this.deleteFile}
        openFolder={this.openFolder}
      />

    let newFolder =
      <span>
        <Popover open={this.state.open}
          animated={false}
          anchorEl={this.state.anchor}
          onRequestClose={this.closeInput}
          style={{ overflowY: 'none'}}
        >
          <Menu>
            <TextField ref='folder'
              onKeyPress={(e) => {e.key=='Enter' &&  this.createFolder()}}
              floatingLabelText='folder name'
              underlineFocusStyle={styles.input}
              style={styles.button}
              autoFocus={true}
            />
            <FlatButton label="create"
              onClick={this.createFolder}/>
          </Menu>
        </Popover>
        <IconButton onClick={this.openInput}
          iconStyle={styles.large}
          style={styles.button}
          tooltip="NEW FOLDER"
          >
            <NewFolder color={blue500}/>
        </IconButton>
      </span>

    let backButton = (this.state.parent != "") ?
      <span style={styles.back}>
        <FloatingActionButton onClick={this.goBack}
          style={styles.button}
          backgroundColor={grey600}>
          <Back/>
        </FloatingActionButton>
      </span> :
      null


    return (
      <div>
        {backButton}
        <div style={{textAlign: 'center'}}>
          <Paper style={styles.card}>
            {newFolder}
          </Paper>
          <Paper style={styles.card}>
            <Preview
              user={this.props.user}
              parent={this.state.parent}
            />
          </Paper>
        </div>
        {files}
      </div>
    )
  }
}
module.exports = Folder
