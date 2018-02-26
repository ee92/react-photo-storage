const React = require('react')
const Preview = require('./Preview')
import firebase, { storage, database } from '../firebase'

class Folder extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: this.props.user,
      create: false,
      path: this.props.user.uid,
      folders: []
    }
    this.showInput = this.showInput.bind(this)
    this.createFolder = this.createFolder.bind(this)
  }

  showInput() {
    this.setState({create: !this.state.create})
  }

  createFolder() {
    let key = database.ref().child(this.state.path).push().key
    database.ref().child(this.state.path).child(key).set({
      "folder" : true,
      "name" : this.input.value
    }).then(() => {
      //redundant
      let folders = this.state.folders.slice()
      folders.push(key)
      this.setState({folders})
      this.showInput()
    })
  }

  componentDidMount() {
    const ref = database.ref(this.props.path)

    ref.on('child_added', (child) => {
      let images = this.state.images.slice()
      images.push({
        key: child.key,
        url: child.val().url,
        time: child.val().time,
        name: child.val().name
      })
      this.setState({images})
    })

    ref.on('child_removed', (child) => {
      let images = this.state.images.filter((image) => {
        return image.key != child.key
      })
      this.setState({images})
    })

    ref.on('child_changed', (child) => {
      let images = this.state.images.filter((image) => {
        return image.key != child.key
      })
      images.push({
        key: child.key,
        url: child.val().url,
        time: child.val().time,
        name: child.val().name
      })
      this.setState({images})
    })
  }

  render() {
    let albums = (this.state.folders.length == 0) ?
      <h4>you have no albums</h4> :
      <h4>you have albums</h4>

    let newFolder = (this.state.create) ?
      <div>
        <input ref={(input) => this.input = input}/>
        <button onClick={this.createFolder}>create</button>
      </div> :
      <button onClick={this.showInput}>create album</button>

    return (
      <div>
        {newFolder}
        <Preview
          user={this.props.user}
          path={this.state.path}
        />
        {albums}
      </div>
    )
  }
}
module.exports = Folder
