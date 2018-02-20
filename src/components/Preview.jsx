const React = require('react')
import firebase, { auth, provider, storage, database } from '../firebase'

class Preview extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: this.props.user,
      file: null,
      url: null,
      images: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.writeUserData = this.writeUserData.bind(this)
    this.removeUserData = this.removeUserData.bind(this)
  }

  handleChange(e) {
    this.setState({
      file: e.target,
      url: URL.createObjectURL(e.target.files[0])
    })
  }

  writeUserData() {
    const key = database.ref().child(this.state.user.uid).push().key
    const image = storage.ref().child(this.state.user.uid).child(key)
    image.put(this.state.file.files[0]).then((snap) => {
      database.ref().child(this.state.user.uid).child(key).set({
        "url" : snap.metadata.downloadURLs[0]
      })
    })
    this.state.file.value = ""
    this.setState({
      file: null,
      url: null,
    })
  }

  removeUserData(event) {
    storage.ref().child(event.target.name).delete()
    database.ref().child(this.state.user.uid).child(event.target.name).remove()
  }

  componentDidMount() {
    const ref = database.ref().child(this.state.user.uid)

    ref.on('child_added', (child) => {
      let images = this.state.images.slice()
      images.push({
        key: child.key,
        url: child.val().url
      })
      this.setState({images})
    })

    ref.on('child_removed', (child) => {
      let images = this.state.images.filter((image) => {
        return image.url != child.val().url
      })
      this.setState({images})
    })
  }

  render() {
    const previewStyle = {
      maxHeight: "100px",
      maxWidth: "100px"
    }

    const imgStyle = {
      maxHeight: "400px",
      maxWidth: "400px"
    }

    return (
      <div>
        <input id="input" type="file" onChange={this.handleChange}/>
        <img src={this.state.url} style={previewStyle}/>
        <button onClick={this.writeUserData}>submit</button>
        {this.state.images.map((image) =>
          <div key={image.key}>
            <img src={image.url} style={imgStyle}/>
            <button onClick={this.removeUserData} name={image.key}>remove</button>
          </div>
        )}
      </div>
    );
  }
}
module.exports = Preview
