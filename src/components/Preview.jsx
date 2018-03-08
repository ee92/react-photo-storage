const React = require('react')
import Upload from 'material-ui-upload/Upload'
import IconButton from 'material-ui/IconButton'
import NewImage from 'material-ui/svg-icons/file/file-upload'
import firebase, { storage, database } from '../firebase'
import {blue500} from 'material-ui/styles/colors'

class Preview extends React.Component {

  state = {
    user: this.props.user,
    files: null
  }

  handleSelect = (e) => {
    this.setState({
      files: this.input.files
    }, () => {
      for(var i=0; i<this.state.files.length; i++) {
        this.storePhoto(this.state.files[i])
      }
    })
  }

  handleUpload = () => {
    this.setState({
      file: null
    })
  }

  storePhoto = (file) => {
    console.log(file)
    const key = database.ref(this.props.user.uid).push().key
    const image = storage.ref(this.props.user.uid).child(key)
    image.put(file).then((snap) => {
      database.ref(this.props.user.uid).child(key).set({
        "folder": false,
        "url" : snap.metadata.downloadURLs[0],
        "name" : this.input.value,
        "parent" : this.props.parent
      }).then(this.handleUpload())
    })
  }

  render() {

    const styles = {
      button: {
        margin: 12
      },
      imageInput: {
        cursor: 'pointer',
        visability: 'hidden'
      },
      large: {
        transform: 'scale(3.5)'
      }
    }

    return (
      <span>
        <IconButton
          onClick={() => this.input.click()}
          iconStyle={styles.large}
          style={styles.button}
          tooltip="ADD IMAGES"
        >
          <NewImage color={blue500}/>
        </IconButton>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={this.handleSelect}
          onClick={(event)=> {event.target.value = null}}
          ref={(input) => {this.input = input}}
          style={{display: 'none'}}
        />
      </span>
    )
  }
}
module.exports = Preview
