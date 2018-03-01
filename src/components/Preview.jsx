const React = require('react')
import Upload from 'material-ui-upload/Upload'
import RaisedButton from 'material-ui/RaisedButton'
import firebase, { storage, database } from '../firebase'

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

    const previewStyle = {
      maxHeight: "100px",
      maxWidth: "100px"
    }

    const styles = {
      button: {
        margin: 12
      },
      imageInput: {
        cursor: 'pointer',
        display: 'none'
      }
    }

    return (
      <div>
        <RaisedButton
          label="Upload"
          labelPosition="before"
          style={styles.button}
          containerElement="label"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={this.handleSelect}
            ref={(input) => {this.input = input}}
            style={styles.imageInput}
          />
        </RaisedButton>
      </div>
    )
  }
}
module.exports = Preview
