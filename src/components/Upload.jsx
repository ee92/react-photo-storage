const React = require('react')
import firebase, { storage, database } from '../firebase'

class Upload extends React.Component {
  constructor(props){
    super(props)
    this.storePhoto = this.storePhoto.bind(this)
  }

  storePhoto() {
    const key = database.ref(this.props.user.uid).push().key
    const image = storage.ref(this.props.user.uid).child(key)
    image.put(this.props.file).then((snap) => {
      console.log(this.props.parent)
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
