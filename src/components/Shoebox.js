import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Tooltip from '@material-ui/core/Tooltip'

import { Grow, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { deleteShoeboxItem, updateShoeboxItemNotes} from '../store/actions/shoeboxActions'

const styles = theme => ({
    hidden: {
        display: 'none' 
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 300,
          },
    },
    paper: {
        marginTop: 0,
        width: '100%',
        overflowX: 'auto',
        marginBottom: 0,
        maxHeight: 500, 
        overflow: 'auto',
        'pointer-events': 'auto',
    },
    table: {
        minWidth: 160,
    },
    head: {
        backgroundColor: "#fff",
        position: "sticky",
        top: 0
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
    li: {
        paddingTop: '2px',
        paddingBottom: '2px',
    },
    inline: {
        display: 'inline',
    },
    empty: {
        margin: 100,
    }
});

class Shoebox extends Component {

    renderUrl(doi) {
        return "https://doi.org/"+doi;
    }

    renderGridId(id) {
        return id.slice(5);
    }

    renderAuthors(source, maxNumber) {
        let authorsText = "";
        if (typeof source.authors !== "undefined") {
            if (source.authors.length > maxNumber) {
                authorsText = source.authors.slice(0, maxNumber).join(", ") + "...";
	    } else {
                authorsText = source.authors.join(", ");
	    }
        }
        return authorsText;
    }

    render() {
        const { classes, isShoebox, shoebox, deleteShoeboxItem, updateShoeboxItemNotes } = this.props;

        const style = {
            boxShadow: 'none',
            margin: '0px', 
            backgroundColor: 'rgba(255,255,255,0.0)',
            position: 'fixed',
            width: '380px',
            height: '290px',
            minHeight: '200px',
            top: 70,
            left: 5,
            padding: '0px', 
            zIndex: 30,
            pointerEvents: 'none',
        }

        const style_list = {
            marginTop: 0,
            width: '100%',
            overflowX: 'auto',
            marginBottom: 0,
            maxHeight: 500, 
            overflow: 'auto',
            pointerEvents: 'auto',
        }

        const style_top = {
            margin: '5px',
        }

        if (isShoebox) {
            return ( 
                <div className={isShoebox ? '' : classes.hidden}>
                    <div className={classes.root} style={style}>
                    <Grow in={isShoebox}>
                        <Paper className={classes.paper}>
                            <div style={style_top}>
                                <Grid container alignItems="center">
                                <Grid item xs>
                                    <Typography gutterBottom variant="h6">
                                    Shoebox
                                    </Typography>
                                </Grid>
                                </Grid>
                            </div>

                            <Divider variant="middle" />

                            {(typeof shoebox === "undefined" || shoebox.length === 0) ?
                            <Typography gutterBottom className={classes.empty}> Your shoebox is empty!</Typography>:
                            <List className={classes.root} style={style_list}>
                                {shoebox.map((source, index) => (
                                <ListItem key={source.doi} alignItems="flex-start">
                                    <Grid container direction="column">
                                    <Grid container>
                                    <Grid item xs>
                                    <ListItemText
                                        primary={
                                            <a href={this.renderUrl(source.doi)}>{source.title}</a>
                                        }
                                        secondary={
                                            <React.Fragment>
                                            <Grid container direction="column">
                                            <Grid item xs><Typography variant="body2" className={classes.inline}>
                                                {this.renderAuthors(source, 3)}
                                            </Typography></Grid>
                                            <Grid item xs><Typography variant="caption" className={classes.inline}>
                                                {source.query + ", "} {this.renderGridId(source.gridId)}
                                            </Typography></Grid>
                                            </Grid>
                                            </React.Fragment>
                                        }      
                                    /></Grid>
                                    <Tooltip title="Remove from shoebox" aria-label="Remove from shoebox"><IconButton onClick={() => deleteShoeboxItem(index)}><DeleteIcon/></IconButton></Tooltip></Grid>
                                    <TextField label="Notes" id="notes" multiline rowsMax={4} defaultValue={source.notes} onChange={(event) => updateShoeboxItemNotes(index, event.target.value)}></TextField>
                                    </Grid>
                                    </ListItem>
                                ))}
                            </List>
                            }
                        </Paper>
                    </Grow>
                    </div>
                </div>
            )
        } else {
            return (<div className={classes.hidden}></div>);
        }
    }
}

const mapStateToProps = state => {
    return {
        shoebox: state.firebase.profile.shoebox
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
        deleteShoeboxItem: (index) => { dispatch(deleteShoeboxItem(index)) },
        updateShoeboxItemNotes: (index, notes) => { dispatch(updateShoeboxItemNotes(index, notes)) },
        dispatch
    });
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(withStyles(styles)(Shoebox));
