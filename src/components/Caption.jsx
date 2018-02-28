const React = require('react')
import firebase, { database } from '../firebase'

class Caption extends React.Component {

  state = {
    hidden: true
  }

  changeCaption = () => {
    this.setState({ hidden: !this.state.hidden })
  }

  saveCaption = () => {
    let path = this.props.parent ?
      this.props.user.uid :
      this.props.user.uid + "/" + this.props.parent
    database.ref(path).child(this.props.file).update({
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
          <input ref={(input) => this.input = input} defaultValue={this.props.name}/>
          <button onClick={this.saveCaption}>done</button>
        </div>
    );
  }
}
module.exports = Caption
