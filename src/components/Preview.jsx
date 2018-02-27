const React = require('react')
const Upload = require('./Upload')

class Preview extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: this.props.user,
      file: null,
      url: null,
      path: this.props.path
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }

  handleSelect() {
    this.setState({
      file: this.input.files[0],
      url: URL.createObjectURL(this.input.files[0])
    })
  }

  handleUpload() {
    this.input.value = ""
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

    return (
      <div>
        <input
          type="file"
          onChange={this.handleSelect}
          ref={(input) => {this.input = input}}
        />
        <img src={this.state.url} style={previewStyle}/>
        <Upload
          handleUpload={this.handleUpload}
          file={this.state.file}
          user={this.state.user}
          input={this.input}
          parent={this.props.parent}
        />
      </div>
    );
  }
}
module.exports = Preview
