import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { doDOISearch } from '../store/actions/queryActions';

const styles = theme => ({
    hidden: {
        display: 'none' 
    },
    root: {
        width: '100%',
    },
    paper: {
        marginTop: 0,
        width: '100%',
        overflowX: 'auto',
        marginBottom: 0,
        maxHeight: 290, 
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
    }
});


class TopNResults extends Component {

    componentDidUpdate(prevProps) {
       const { doDOISearch, selectedGridId, timelineSelectionStart, timelineSelectionEnd, institutionYearSearchResult } = this.props;
       if ((prevProps.institutionYearSearchResult !== institutionYearSearchResult) || 
           (prevProps.timelineSelectionStart !== timelineSelectionStart) ||
           (prevProps.timelineSelectionEnd !== timelineSelectionEnd) ||
           (prevProps.selectedGridId !== selectedGridId)) {
           doDOISearch(selectedGridId);
       }
    }

    render() {
        const { classes, doiSearchResult } = this.props;
        const style = {
            boxShadow: 'none',
            margin: '0px', 
            backgroundColor: 'rgba(255,255,255,0.0)',
            position: 'fixed',
            width: '180px',
            height: '290px',
            top: 70,
            right: 5,
            padding: '0px', 
            zIndex: 30,
            pointerEvents: 'none',
        }
        if (doiSearchResult && doiSearchResult.results) {
        return ( 
            <div className={(doiSearchResult && doiSearchResult.results) ? '' : classes.hidden}>
                <div className={classes.root} style={style}>
                    <Paper className={classes.paper}>
                        <Table className={classes.table} size="small">
                            <TableHead>
                                <TableCell className={classes.head}>{doiSearchResult.total} results</TableCell>
                            </TableHead>
                            <TableBody>
                                {doiSearchResult.results.map( (row, index) => (
                                    <TableRow key={row.source.doi}>
                                        <TableCell align="left">{index + 1}. <a target="_blank" href={`https://doi.org/${row.source.doi}`}>{row.source.title[0]}</a></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            </div> 
	);
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
)(withStyles(styles)(TopNResults));
