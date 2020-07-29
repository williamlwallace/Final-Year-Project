import React, {Component} from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Map from './Map';
import Timeline from './Timeline';
import TopNResults from './TopNResults';
import SearchField from './SearchField';
import YearSlider from './YearSlider';
import LoginDialog from './LoginDialog';

const styles = theme => ({
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    },
    button: {
        margin: theme.spacing(1),
    },
    appBar: {
        background: theme.palette.primary[500],
        opacity: 0.95,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
});

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {isOpen: false};
    }

    toggleDialog = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        const containerStyle = {
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'fixed',
        };

        const { classes, auth } = this.props;

        return (        
            <div style={containerStyle}>
                <div className={classes.root}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" gutterBottom color="inherit" className={classes.flex}>
	                        COKI Explorer
                            </Typography>
	                    <SearchField />
                        <Button variant="contained" className={classes.button} onClick={this.toggleDialog}>
                            Login
                        </Button>
                        </Toolbar>
                    </AppBar>

                    <Dialog open={this.state.isOpen} onClose={this.toggleDialog} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Login</DialogTitle>
                        <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="username"
                            label="Username"
                            type="text"
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button variant="text" onClick={this.toggleDialog} color="primary">
                            Register
                        </Button>
                        <Button variant="contained" onClick={this.toggleDialog} color="primary">
                            Login
                        </Button>
                        </DialogActions>
                    </Dialog>

                </div>
                <Map />
                <Timeline />
                <TopNResults />
            </div>
	);
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    const { auth } = state;

    return {
        auth,
    };
};

const mapDispatchToProps = (dispatch) => {
    return { };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Home));

