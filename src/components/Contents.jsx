const React = require('react')
const Caption = require('./Caption')
import firebase, { database } from '../firebase'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import Chip from 'material-ui/Chip'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import TextField from 'material-ui/TextField'
import Folder from 'material-ui/svg-icons/file/folder'
import {GridList, GridTile} from 'material-ui/GridList'
import {Card, CardMedia, CardTitle, CardActions} from 'material-ui/Card'
import {blue500, grey600, red500, red100} from 'material-ui/styles/colors'
import sad from "./../../images/sad.png"

class Contents extends React.Component {

  render() {

    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: 12
      },
      folders: {
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto'
      },
      images: {
        overflowY: 'auto'
      },
      tile: {
        transform: 'scale(1)'
      },
      button: {
        cursor: 'pointer'
      }
    }

    return (
      <div>
        <div style={styles.root}>
          <GridList
            style={styles.folders}
            cols={3.3}
          >
            {this.props.files.filter((file) => file.folder).map((file) =>
              <GridTile
                key={file.key}
                cols={3.3}
                title={file.name}
                style={styles.tile}
                actionIcon={
                  <IconButton>
                    <Delete onClick={this.props.deleteFile.bind(this, file.key, true)}
                      hoverColor='white'
                    />
                  </IconButton>
                }
              >
                <img src={sad}
                  style={styles.button}
                  onClick={this.props.openFolder.bind(this, file.key)}
                />
              </GridTile>
            )}
          </GridList>
        </div>
        <GridList cols={3} style={styles.images}>
          {this.props.files.filter((file) => !file.folder).map((file) =>
            <GridTile key={file.key}>
              <img src={file.url}/>
            </GridTile>
          )}
        </GridList>

      </div>
    )
  }
}
module.exports = Contents
