const React = require('react')
const Caption = require('./Caption')
import firebase, { database } from '../firebase'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import {Card, CardMedia, CardTitle} from 'material-ui/Card'

class Contents extends React.Component {

  render() {
    const styles = {
      button: {
        margin: 12
      },
      card: {
        textAlign: 'center',
        margin: 'auto',
        marginBottom: 24,
        maxWidth: '50%'
      }
    }
    return (

      this.props.files.slice().map((file) => {
        if (file.folder) {
          return(
            <Card style={styles.card} key={file.key} zDepth={2}>
              <RaisedButton
                onClick={this.props.openFolder.bind(this, file.key)}
                label="open"
                style={styles.button}></RaisedButton>
              <Caption
                name={file.name}
                file={file.key}
                user={this.props.user}
                parent={this.props.parent}
              />
              <RaisedButton
                onClick={this.props.deleteFile.bind(this, file.key, true)}
                name={file.key}
                folder="true"
                label="remove"
                style={styles.button}
              ></RaisedButton>
            </Card>
          )
        }
        else {
          return(
            <Card style={styles.card} key={file.key} zDepth={2}>
              <CardMedia>
                <img src={file.url}/>
              </CardMedia>
              <Caption
                name={file.name}
                file={file.key}
                user={this.props.user}
                parent={this.props.parent}/>
              <RaisedButton
                onClick={this.props.deleteFile.bind(this, file.key, false)}
                name={file.key}
                folder="false"
                label="remove"
                style={styles.button}
              ></RaisedButton>
            </Card>
          )
        }
      })
    )
  }
}
module.exports = Contents
