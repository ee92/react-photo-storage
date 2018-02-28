const React = require('react')
import firebase, { storage, database } from '../firebase'

class Upload extends React.Component {

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
    return (
      <span>
        { this.props.file ?
          <button onClick={this.storePhoto}>upload</button> :
          null }
      </span>
    );
  }
}
module.exports = Upload
