const React = require('react')
import Dialog from 'material-ui/Dialog'
import firebase, { database } from '../firebase'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import Chip from 'material-ui/Chip'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import TextField from 'material-ui/TextField'
import Folder from 'material-ui/svg-icons/file/folder-open'
import Add from 'material-ui/svg-icons/content/add'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import {GridList, GridTile} from 'material-ui/GridList'
import {Card, CardMedia, CardTitle, CardActions} from 'material-ui/Card'
import {blue500, grey600, red500, red100} from 'material-ui/styles/colors'

class Contents extends React.Component {

  state = {
    open: false,
    img: null
  }

  showImage = (img) => {
    this.setState({
      open: true,
      img
    })
  }

  hideImage = () => {
    this.setState({
      open: false,
      img: null
    })
  }

  render() {

    const styles = {
      folders: {
        display: 'flex',
        flexWrap: 'wrap'
      },
      images: {
        overflowY: 'auto'
      },
      button: {
        cursor: 'pointer'
      },
      full: {
        maxWidth: '100%',
        maxHeight: '100%',
        margin: '0 auto',
        display: 'block'
      }
    }

    return (
      <span>
        <span style={styles.folders}>
          {this.props.files.filter((file) => file.folder).map((file) =>
            <Chip
              onRequestDelete={this.props.deleteFile.bind(this, file.key, true)}
              onClick={this.props.openFolder.bind(this, file.key)}
              style={{margin: '6px'}}
              key={file.key}
            >
              <Avatar icon={<Folder />} />
              {file.name}
            </Chip>
          )}
        </span>

        <GridList cols={3} style={styles.images}>
          {this.props.files.filter((file) => !file.folder).map((file) =>
            <GridTile key={file.key}
              actionPosition="right"
              titlePosition="top"
              titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
              title=' '
              actionIcon={
                <IconButton>
                  <Delete onClick={this.props.deleteFile.bind(this, file.key, true)}
                    hoverColor='red'
                    color='white'
                  />
                </IconButton>
              }
            >
              <img src={file.url} onClick={() => this.showImage(file.url)} style={styles.full}/>
              <Dialog open={this.state.open} onRequestClose={this.hideImage}>
                <img src={this.state.img} hidden={!this.state.img} style={styles.full}/>
              </Dialog>
            </GridTile>
          )}
        </GridList>

      </span>
    )
  }
}
module.exports = Contents
