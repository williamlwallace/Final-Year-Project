import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import queryString from 'query-string';
import { setSearchFieldValue } from '../store/actions/searchFieldActions';
import { doInstitutionYearKeywordSearch } from '../store/actions/queryActions';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

const styles = {
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
};

class SearchField extends Component {

    componentDidMount() {
        const { location, setSearchFieldValue, doInstitutionYearKeywordSearch } = this.props;
        const searchVal = queryString.parse(location.search);
        let query = searchVal.q;
        if (!query) query = "";
        setSearchFieldValue(query);
        // on event bus open it will perform the query
        // doInstitutionYearKeywordSearch();
    }

    doKeywordSearch = () => {
        console.log("doing query");
        const { history, doInstitutionYearKeywordSearch, value } = this.props;
        history.push({
            search: "?" + new URLSearchParams({q: value}).toString(),
	});
        doInstitutionYearKeywordSearch();
    }

    handleTextFieldKeyDown = event => {
        switch (event.key) {
            case 'Enter':
                this.doKeywordSearch();
                event.preventDefault();
                break
            case 'Escape':
                // etc...
                break
            default: break
        };
    };

    //handleChange = name => event => {
    //    this.props.setSearchFieldValue(event.target.value);
    //};
    handleChange = event => {
        const { setSearchFieldValue } = this.props;
        setSearchFieldValue(event.target.value);
    };

    render() {
        const { classes, value } = this.props;
        
        return (
            <Paper className={classes.root} elevation={1}>
                <IconButton className={classes.iconButton} aria-label="Menu">
                    <MenuIcon />
                </IconButton>
                <InputBase className={classes.input} 
                           inputProps={ { onKeyDown: this.handleTextFieldKeyDown } }
                           value = { value }
                           onChange = { this.handleChange }
                           placeholder="Search" />
                <IconButton className={classes.iconButton} 
                            onClick={this.doKeywordSearch} 
                            color="primary" 
                            aria-label="Search">
                    <SearchIcon />
                </IconButton>
            </Paper>
	);
    }
}

const mapStateToProps = state => {
    return {
        value: state.searchField.value,
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
        setSearchFieldValue: (value) => { dispatch(setSearchFieldValue(value)) },
        doInstitutionYearKeywordSearch: () => { dispatch(doInstitutionYearKeywordSearch()) },
    });
}

export default withRouter(connect(
    mapStateToProps, mapDispatchToProps
)(withStyles(styles)(SearchField)));
//export default connect(
//    mapStateToProps, mapDispatchToProps
//)(withStyles(styles)(SearchField));
