const React = require('react')
import firebase, { storage, database } from '../firebase'

class Upload extends React.Component {
  constructor(props){
    super(props)
    this.storePhoto = this.storePhoto.bind(this)
  }

  storePhoto() {
    const key = database.ref().child(this.props.user.uid).push().key
    const image = storage.ref().child(this.props.user.uid).child(key)
    image.put(this.props.file).then((snap) => {
      console.log(this.props.user)
      database.ref().child(this.props.user.uid).child(key).set({
        "url" : snap.metadata.downloadURLs[0],
        "time" : snap.metadata.timeCreated,
        "name" : this.props.input.value
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
