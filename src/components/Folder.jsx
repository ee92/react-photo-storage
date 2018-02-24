const React = require('react')
import firebase, { storage, database } from '../firebase'

class Folder extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: this.props.user,
      create: false,
      folders: []
    }
    this.showInput = this.showInput.bind(this)
    this.createFolder = this.createFolder.bind(this)
  }

  showInput() {
    this.setState({create: !this.state.create})
  }

  createFolder() {
    let key = database.ref().child(this.props.user.uid).push().key
    database.ref().child(this.props.user.uid).child(key).set({
      "folder" : true,
      "name" : this.input.value
    }).then(() => {
      let folders = this.state.folders.slice()
      folders.push(key)
      this.setState({folders})
      this.showInput()
    })
  }

  componentDidMount() {
    database.ref(this.props.user.uid).on('value', (snap) => {
      console.log(snap.val())

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
        {albums}
      </div>
    )
  }
}
module.exports = Folder
