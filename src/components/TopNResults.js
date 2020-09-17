import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import StarIcon from '@material-ui/icons/Star';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

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
    iconButton: {
        marginRight: 10,
    },
});


class TopNResults extends Component {

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

    renderUrl(source) {
        let url = "https://doi.org/"+source.doi;
	if (typeof source.url_for_pdf !== "undefined") {
            url = source.url_for_pdf;
	} else if (typeof source.url_for_landing_page !== "undefined") {
            url = source.url_for_landing_page;
	}
        return url;
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

    renderPublication(source) {
       let pubText = "";
       if (typeof source.journal_name !== "undefined") {
           pubText += source.journal_name;
       }
       if (typeof source.citation_count !== "undefined") {
           if (typeof source.journal_name !== "undefined") {
               pubText += ", ";
	   }
           pubText += source.citation_count + " citations";
       }
       return pubText;
    }

    render() {
        const { classes, doiSearchResult } = this.props;
        const style = {
            boxShadow: 'none',
            margin: '0px', 
            backgroundColor: 'rgba(255,255,255,0.0)',
            position: 'fixed',
            width: '380px',
            height: '290px',
            top: 70,
            right: 5,
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

        if (doiSearchResult && doiSearchResult.results) {
        return ( 
            <div className={(doiSearchResult && doiSearchResult.results) ? '' : classes.hidden}>
                <div className={classes.root} style={style}>
                    <Paper className={classes.paper}>
                        <div style={style_top}>
                            <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography gutterBottom variant="h6">
                                {doiSearchResult.institution_name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography gutterBottom variant="h7">
                                {doiSearchResult.total} results
                                </Typography>
                            </Grid>
                            </Grid>
                        </div>

                        <Divider variant="middle" />

                        <List className={classes.root} subheader={<li />} style={style_list}>
                            {[...new Set(doiSearchResult.results.map( data => data.source.published_year))].sort().reverse().map(sectionId => (
                                <li key={`section-${sectionId}`} className={classes.listSection}>
                                <ul className={classes.ul}>
                                    <ListSubheader>{`${sectionId}`}</ListSubheader>
                                    {doiSearchResult.results.filter(function(publication) {return publication.source.published_year === sectionId;}).map( (row, index) => (
                                    <ListItem key={row.source.doi}>
                                        <IconButton className={classes.iconButton}><ChevronLeftIcon /></IconButton>
                                        <ListItemText 
					    primary={
			                        <React.Fragment>
                                                    <a href={this.renderUrl(row.source)} _target="blank">
						        {row.source.title[0]}
						    </a>
                                                </React.Fragment>
					    } 
					    secondary={
					        <React.Fragment>
						    <Typography
						        component="span"
						        variant="body2"
						        className={classes.inline}
						        color="textPrimary"
						    >{this.renderAuthors(row.source, 3)}</Typography>
						    <br/>
					            {this.renderPublication(row.source)}
					        </React.Fragment>
					    } 
					/>
                                    </ListItem>
                                    ))}
                                </ul>
                                </li>
                            ))}
                        </List>
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
)(withStyles(styles)(TopNResults));
