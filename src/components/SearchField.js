import React, { Component } from 'react';
import { connect } from 'react-redux';
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

    constructor(props) {
        super(props);
        this.state = {
            query: '',
        };
    }

    componentDidMount() { }

    handleChange = name => event => {
        this.props.setSearchFieldValue(event.target.value);
    };

    //componentDidMount() {
        //doInstitutionYearKeywordSearch();
    //}

    handleTextFieldKeyDown = event => {
        switch (event.key) {
            case 'Enter':
                this.props.doInstitutionYearKeywordSearch();
                event.preventDefault();
                break
            case 'Escape':
                // etc...
                break
            default: break
        };
    };

    render() {
        const { classes } = this.props;
        
        return (
            <Paper className={classes.root} elevation={1}>
                <IconButton className={classes.iconButton} aria-label="Menu">
                    <MenuIcon />
                </IconButton>
                <InputBase className={classes.input} 
                           inputProps={ { onKeyDown: this.handleTextFieldKeyDown } }
                           value = { this.props.query }
                           onChange = { this.handleChange('query') }
                           placeholder="Search" />
                <IconButton className={classes.iconButton} 
                            onClick={this.props.doInstitutionYearKeywordSearch} 
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
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
        setSearchFieldValue: (value) => { dispatch(setSearchFieldValue(value)) },
        doInstitutionYearKeywordSearch: () => { dispatch(doInstitutionYearKeywordSearch()) },
    });
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(withStyles(styles)(SearchField));
