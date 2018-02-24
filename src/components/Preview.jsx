const React = require('react')
const Upload = require('./Upload')

class Preview extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: this.props.user,
      file: null,
      url: null,
      input: null
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }

  handleSelect(e) {
    this.setState({
      input: e.target,
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0])
    })
  }

  handleUpload() {
    this.state.input.value = ""
    this.setState({
      input: null,
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
        <a href={window.location.href + "?user=" + this.state.user.uid}>{window.location.href}</a><br/>
        <input type="file" onChange={this.handleSelect}/>
        <img src={this.state.url} style={previewStyle}/>
        <Upload
          handleUpload={this.handleUpload}
          file={this.state.file}
          user={this.state.user}
          input={this.state.input}/>
      </div>
    );
  }
}
module.exports = Preview
