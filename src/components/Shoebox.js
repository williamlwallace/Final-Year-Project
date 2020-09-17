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

import { doDOISearch } from '../store/actions/queryActions';

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

    componentDidUpdate(prevProps) {
        const { doDOISearch, 
            selectedGridId, 
            timelineSelectionStart, 
            timelineSelectionEnd, 
            institutionYearSearchResult } = this.props;
        if ((prevProps.institutionYearSearchResult !== institutionYearSearchResult) || 
            (prevProps.timelineSelectionStart !== timelineSelectionStart) ||
            (prevProps.timelineSelectionEnd !== timelineSelectionEnd) ||
            (prevProps.selectedGridId !== selectedGridId)) {
            doDOISearch(selectedGridId);
        }
    }

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
                            <List>
                                hi
                            </List>
                        </Paper>
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
        institutionYearSearchResult: state.queryResults.institutionYearSearchResult,
        doiSearchResult: state.queryResults.doiSearchResult,
        pickedGridId: state.map.pickedGridId,
        selectedGridId: state.map.selectedGridId,
        yearSliderSelectionStart: state.yearSlider.selectionStart,
        yearSliderSelectionEnd: state.yearSlider.selectionEnd,
        timelineSelectionStart: state.timeline.selectionStart,
        timelineSelectionEnd: state.timeline.selectionEnd,
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
        doDOISearch: (gridId) => { dispatch(doDOISearch(gridId)) },
    });
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(withStyles(styles)(Shoebox));
