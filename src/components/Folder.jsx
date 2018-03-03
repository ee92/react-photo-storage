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
import NewFolder from 'material-ui/svg-icons/image/add-to-photos'
import TextField from 'material-ui/TextField'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import {blueGrey500} from 'material-ui/styles/colors'
import sad from "./../../images/sad.png"


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

  closeInput = () => {
    this.setState({
      open: false
    })
  }

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
      "parent" : this.state.parent
    })
    this.closeInput()
  }

  openFolder = (parent) => {
    this.setState({
      parent: parent,
      files: [],
      name: name
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
    if (this.ref) {this.ref.off()}
    this.ref = database.ref(this.props.user.uid).orderByChild('parent').equalTo(this.state.parent)

    this.ref.on('child_added', (child) => {
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
      let files = this.state.files.filter((file) => {
        return file.key != child.key
      })
      this.setState({files})
    })

    this.ref.on('child_changed', (child) => {
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
        margin: 48
      },
      card: {
        textAlign: 'center',
        margin: 'auto'
      },
      noFiles: {
        textAlign: 'center',
        margin: 'auto',
        maxWidth: '30%'
      },
      large: {
        width: 100,
        height: 100
      },
      input: {
        margin: 12
      },
      back: {
        position: 'absolute',
        float: 'left',
        zIndex: 1
      }
    }

    let files = (this.state.files.length == 0) ?
      <Card style={styles.noFiles}>
        <CardMedia
          overlay={<CardTitle subtitle="no files here"/>}>
          <img src={sad}/>
        </CardMedia>
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
              autoFocus={true}
              floatingLabelText='folder name'
              style={styles.input}
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
            <NewFolder color={blueGrey500}/>
        </IconButton>
      </span>

    let backButton = (this.state.parent != "") ?
      <span style={styles.back}>
        <FloatingActionButton onClick={this.goBack}
          style={styles.button}
          backgroundColor={blueGrey500}>
          <Back/>
        </FloatingActionButton>
      </span> :
      null


    return (
      <div>
        {backButton}
        <div style={styles.card}>
          {newFolder}
          <Preview
            user={this.props.user}
            parent={this.state.parent}
          />
        </div>
        {files}
      </div>
    )
  }
}
module.exports = Folder
