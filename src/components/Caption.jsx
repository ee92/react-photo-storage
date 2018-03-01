const React = require('react')
import firebase, { database } from '../firebase'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

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
      "name" : this.refs.caption.input.value
    }).then(this.changeCaption())
  }

  render() {
    const styles = {
      button: {
        margin: 12
      }
    }
    return (
      this.state.hidden ?
        <div>
          {this.props.name}
          <RaisedButton onClick={this.changeCaption}
            label="edit"
            style={styles.button}></RaisedButton>
        </div> :
        <div>
          <TextField ref='caption'
            defaultValue={this.props.name}
            name={this.props.name}/>
          <RaisedButton onClick={this.saveCaption}
            label="done"
            style={styles.button}></RaisedButton>
        </div>
    );
  }
}
module.exports = Caption
