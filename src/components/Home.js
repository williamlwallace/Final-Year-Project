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
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Snackbar from '@material-ui/core/Snackbar'
import { Alert } from '@material-ui/lab';
import Map from './Map';
import Timeline from './Timeline';
import TopNResults from './TopNResults';
import SearchField from './SearchField';
import YearSlider from './YearSlider';
import { loginUser, logoutUser, createUser } from "../store/actions/authActions";
import { GoogleLogin } from 'react-google-login'

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
        this.state = {
            isOpen: false,
            isRegister: false,
            email: "",
            password: "",
            confirmpassword: "",
            passwordError: false,
            open: false
        };
    }

    handleUserInput (e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({name: value});
    };

    handleEmailChange = ({ target }) => {
        this.setState({ email: target.value });
    };
  
    handlePasswordChange = ({ target }) => {
        this.setState({ password: target.value });
    };

    handleConfirmPasswordChange = ({ target }) => {
        this.setState({ confirmPassword: target.value });
    };

    toggleDialog = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    toggleRegister = () => {
        this.setState({
            isRegister: !this.state.isRegister,
            passwordError: false
        });
    }

    setRegisterState = () => {
        this.setState({
            isRegister: false
        })
    }

    handleLogin = () => {
        const { dispatch } = this.props;
        const { email, password } = this.state;
        dispatch(loginUser(email, password));
        this.toggleDialog()
    };

    handleRegister = () => {
        const { dispatch } = this.props;
        const { email, password, confirmpassword } = this.state;
        if (password !== confirmpassword) {
            console.log(password !== confirmpassword)
            console.log(password)
            console.log(confirmpassword)
            this.setState({passwordError: true})
        } else {
            dispatch(createUser(email, password))
            this.toggleDialog()     
        }
    }

    handleLogout = () => {
        const { dispatch } = this.props;
        dispatch(logoutUser());
    };

    responseGoogle = (response) => {
        console.log(response);
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

        const { classes, isAuthenticated } = this.props;

        return (        
            <div style={containerStyle}>
                <div className={classes.root}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" gutterBottom color="inherit" className={classes.flex}>
	                        COKI Explorer
                            </Typography>
	                    <SearchField />
                        {isAuthenticated ? 
                        <Button variant="contained" className={classes.button} onClick={this.handleLogout}>Logout</Button>:
                        <Button variant="contained" className={classes.button} onClick={this.toggleDialog}>Login</Button>
                        }
                        </Toolbar>
                    </AppBar>

                    <Snackbar open={isAuthenticated} autoHideDuration={3000} onClose={() => this.setState({open: false})}><Alert severity="success">Log in successful!</Alert></Snackbar>

                    <Dialog open={this.state.isOpen} onClose={this.toggleDialog} aria-labelledby="form-dialog-title">
                    {this.state.isRegister ?
                        [<DialogTitle id="form-dialog-title">Register</DialogTitle>,
                                <DialogContent>
                                <TextField
                                    name="email"
                                    margin="dense"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    onChange={(event) => this.handleUserInput(event)}
                                />
                                <TextField
                                    name="password"
                                    margin="dense"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    error={this.state.passwordError}
                                    onChange={(event) => this.handleUserInput(event)}
                                />
                                <TextField
                                    name="confirmPassword"
                                    margin="dense"
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                    error={this.state.passwordError}
                                    onChange={(event) => this.handleUserInput(event)}
                                />
                                </DialogContent>,
                                <DialogActions>
                                    <Button variant="text" onClick={this.toggleRegister} color="primary">
                                        Back
                                    </Button>
                                    <Button variant="contained" onClick={this.handleRegister} color="primary">
                                        Create
                                    </Button>
                                </DialogActions>]
                    :
                        [<DialogTitle id="form-dialog-title">Login</DialogTitle>,
                            <DialogContent>
                            <TextField
                                autoFocus
                                id="username"
                                label="Username"
                                type="text"
                                fullWidth
                                onChange={this.handleEmailChange}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                fullWidth
                                onChange={this.handlePasswordChange}
                            />

                            <GoogleLogin
                                clientId="1009140869228-g9refvfpf18q1rmic202610flr5pj9ot.apps.googleusercontent.com"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />

                            </DialogContent>,
                            <DialogActions>
                            <Button variant="text" onClick={this.toggleRegister} color="primary">
                                Register
                            </Button>
                            <Button variant="contained" onClick={this.handleLogin} color="primary">
                                Login
                            </Button>
                        </DialogActions>]
                    }
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
    return {
        isLoggingIn: state.auth.isLoggingIn,
        loginError: state.auth.loginError,
        isAuthenticated: state.auth.isAuthenticated,
        isLoggingOut: state.auth.isLoggingOut,
        logoutError: state.auth.logoutError
    }
};

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Home));

