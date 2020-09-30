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

import { Grow, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
    hidden: {
        display: 'none' 
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
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
});

class Shoebox extends Component {

    render() {
        const { classes, isShoebox } = this.props;

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
            'pointer-events': 'auto',
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
                            <List className={classes.root} style={style_list}>
                                <ListItem>
                                <ListItemText
                                    primary={
                                        <a href="www.google.com">Increasing complexity with quantum physics</a>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={classes.inline}>
                                            Janet Anders, Karoline Wiesner
                                        </Typography>
                                    }      
                                />
                                <ListItemText secondary={
                                      <Typography variant="body2" className={classes.inline}>
                                      Quantum physics (11.46)
                                  </Typography>
                                }
                                />
                                <IconButton className={classes.iconButton}><DeleteIcon/></IconButton>
                                </ListItem>
                                <TextField className={classes.style_top}></TextField>
                            </List>
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
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
        dispatch
    });
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(withStyles(styles)(Shoebox));
