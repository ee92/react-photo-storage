const React = require('react')
const Uploader = require('./Uploader')
import Upload from 'material-ui-upload/Upload'
import RaisedButton from 'material-ui/RaisedButton'

class Preview extends React.Component {

  state = {
    user: this.props.user,
    file: null,
    url: null,
    path: this.props.path
  }

  handleSelect = (e) => {
    this.setState({
      file: this.input.files[0],
      url: URL.createObjectURL(this.input.files[0])
    })
  }

  handleUpload = () => {
    // this.input.value = ""
    this.setState({
      file: null,
      url: null
    })
  }

  render() {
    const previewStyle = {
      maxHeight: "100px",
      maxWidth: "100px"
    }

    const styles = {
      button: {
        margin: 12
      },
      imageInput: {
        cursor: 'pointer',
        display: 'none'
      }
    }

    return (
      <div>
        <RaisedButton
          label="Upload"
          labelPosition="before"
          style={styles.button}
          containerElement="label"
        >
          <input
            type="file"
            accept="image/*"
            onChange={this.handleSelect}
            ref={(input) => {this.input = input}}
            style={styles.imageInput}
          />
        </RaisedButton>
        <img src={this.state.url} style={previewStyle}/>
        <Uploader
          handleUpload={this.handleUpload}
          file={this.state.file}
          user={this.state.user}
          input={this.input}
          parent={this.props.parent}
        />
      </div>
    )
  }
}
module.exports = Preview
