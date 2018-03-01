const React = require('react')
import firebase, { storage, database } from '../firebase'
import RaisedButton from 'material-ui/RaisedButton'

class Uploader extends React.Component {

  storePhoto = () => {
    const key = database.ref(this.props.user.uid).push().key
    const image = storage.ref(this.props.user.uid).child(key)
    image.put(this.props.file).then((snap) => {
      database.ref(this.props.user.uid).child(key).set({
        "folder": false,
        "url" : snap.metadata.downloadURLs[0],
        "name" : this.props.input.value,
        "parent" : this.props.parent
      }).then(this.props.handleUpload())
    })
  }

  render() {
    const styles = {
      button: {
        margin: 12
      }
    }
    return (
      <span>
        { this.props.file ?
          <RaisedButton onClick={this.storePhoto}
            label="confirm"
            style={styles.button}></RaisedButton> :
          null }
      </span>
    );
  }
}
module.exports = Uploader
