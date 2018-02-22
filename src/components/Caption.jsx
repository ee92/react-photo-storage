const React = require('react')
import firebase, { database } from '../firebase'

class Caption extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      hidden: true
    }
    this.changeCaption = this.changeCaption.bind(this)
    this.saveCaption = this.saveCaption.bind(this)
  }

  changeCaption() {
    this.setState({ hidden: !this.state.hidden })
  }

  saveCaption() {
    database.ref().child(this.props.user.uid).child(this.props.image).update({
      "name" : this.input.value
    }).then(this.changeCaption())
  }

  render() {
    return (
      this.state.hidden ?
        <div>
          {this.props.name}
          <button onClick={this.changeCaption}>edit</button>
        </div> :
        <div>
          <input ref={(input) => this.input = input}/>
          <button onClick={this.saveCaption}>done</button>
        </div>
    );
  }
}
module.exports = Caption
