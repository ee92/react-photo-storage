const React = require('react')
const Caption = require('./Caption')
import firebase, { storage, database } from '../firebase'

class Photos extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: this.props.user,
      images: []
    }
    this.deletePhoto = this.deletePhoto.bind(this)
  }

  deletePhoto(event) {
    storage.ref().child(this.props.path).delete()
    database.ref().child(this.props.path).remove()
  }

  componentDidMount() {
    const ref = database.ref().child(this.state.user.uid)

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

    return (
      <div>
        {this.state.images.slice(0).reverse().map((image) =>
          <div key={image.key} style={divStyle}>
            <img src={image.url} style={imgStyle}/>
            <Caption
              name={image.name}
              image={image.key}
              user={this.state.user}/>
            <button onClick={this.deletePhoto} name={image.key}>remove</button>
          </div>
        )}
      </div>
    );
  }
}
module.exports = Photos
