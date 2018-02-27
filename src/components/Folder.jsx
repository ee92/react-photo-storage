const React = require('react')
const Preview = require('./Preview')
const Caption = require('./Caption')
import firebase, { storage, database } from '../firebase'

class Folder extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: this.props.user,
      create: false,
      parent: "",
      files: []
    }
    this.showInput = this.showInput.bind(this)
    this.createFolder = this.createFolder.bind(this)
    this.deleteFile = this.deleteFile.bind(this)
    this.openFolder = this.openFolder.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.goBack = this.goBack.bind(this)

    this.ref = null
  }

  showInput() {
    this.setState({create: !this.state.create})
  }

  deleteFile(e) {
    if (e.target.folder == "false") {
      storage.ref(this.props.user.uid).child(e.target.name).delete()
    }
    database.ref(this.props.user.uid).child(e.target.name).remove()
  }

  createFolder() {
    let key = database.ref(this.props.user.uid).push().key
    database.ref(this.props.user.uid).child(key).set({
      "folder" : true,
      "name" : this.input.value,
      "parent" : ""
    })
    this.showInput()
  }

  openFolder(e) {
    this.setState({
      parent: e.target.getAttribute('parent'),
      files: []
    }, () => {
      this.handleChange()
    })
  }

  goBack() {
    if (this.state.parent) {
      database.ref(this.props.user.uid + "/" + this.state.parent).once('value', (snap) => {
        this.setState({
          parent: snap.val().parent,
          files: []
        }, () => {
          this.handleChange()
        })
      })
    }
  }

  handleChange() {
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

    const imgStyle = {
      maxHeight: "400px",
      maxWidth: "400px"
    }

    const divStyle ={
      padding: "10px",
      margin: "5px",
      textAlign: "center",
      border: "solid black 1px",
      maxWidth: "50%"
    }

    let files = (this.state.files.length == 0) ?
      <h4>you have no files</h4> :
      <div>
        {this.state.files.slice(0).reverse().map((file) => {
          if (file.folder) {
            return(
              <div key={file.key} style={divStyle}>
                <button onClick={this.openFolder} parent={file.key}>open</button>
                <Caption
                  name={file.name}
                  file={file.key}
                  user={this.props.user}
                  parent={this.state.parent}
                />
                <button onClick={this.deleteFile}
                  name={file.key}
                  folder="true"
                >remove</button>
              </div>
            )
          }
          else {
            return(
              <div key={file.key} style={divStyle}>
                <img src={file.url} style={imgStyle}/>
                <Caption
                  name={file.name}
                  file={file.key}
                  user={this.props.user}
                  parent={this.state.parent}/>
                <button onClick={this.deleteFile}
                  name={file.key}
                  folder="false"
                >remove</button>
              </div>
            )
          }
        })}
      </div>

    let newFolder = (this.state.create) ?
      <div>
        <input ref={(input) => this.input = input}/>
        <button onClick={this.createFolder}>create</button>
      </div> :
      <button onClick={this.showInput}>create album</button>

    let backButton = (this.state.parent != "") ?
      <div>
        <button onClick={this.goBack}> back </button>
      </div> :
      null


    return (
      <div>
        {newFolder}
        <Preview
          user={this.props.user}
          parent={this.state.parent}
        />
        {backButton}
        {files}
      </div>
    )
  }
}
module.exports = Folder
