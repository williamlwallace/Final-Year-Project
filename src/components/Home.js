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
import Profile from './Profile'
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
            isProfile: false,
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            passwordError: false,
            open: false
        };
    }

    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
      }

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

    toggleProfile = () => {
        this.setState({
            isProfile: !this.state.isProfile
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
        const { firstName, lastName, email, password, confirmPassword } = this.state;
        if (password !== confirmPassword) {
            this.setState({passwordError: true})
        } else {
            dispatch(createUser(firstName, lastName, email, password))
            this.toggleDialog()     
        }
    }

    handleLogout = () => {
        const { dispatch } = this.props;
        this.setState({isProfile: false})
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

        const { classes, isAuthenticated, profile } = this.props;

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
                        [<Button variant="contained" className={classes.button} onClick={this.handleLogout}><Typography variant="button" display="block" gutterBottom>Logout</Typography></Button>,
                        <Button variant="contained" color="secondary" className={classes.button} onClick={this.toggleProfile}><Typography variant="button" display="block" gutterBottom>{profile.initials}</Typography></Button>]:
                        <Button variant="contained" className={classes.button} onClick={this.toggleDialog}>Login</Button>
                        }
                        </Toolbar>
                    </AppBar>

                    {/* <Snackbar open={profile.isEmpty} autoHideDuration={3000} onClose={() => this.setState({open: false})}><Alert severity="success">Log in successful!</Alert></Snackbar> */}

                    <Dialog open={this.state.isOpen} onClose={this.toggleDialog} aria-labelledby="form-dialog-title">
                    {this.state.isRegister ?
                        [<DialogTitle id="form-dialog-title">Register</DialogTitle>,
                                <DialogContent>
                                <TextField
                                    id="firstName"
                                    margin="dense"
                                    label="First Name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange}
                                />
                                <TextField
                                    id="lastName"
                                    margin="dense"
                                    label="Last Name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange}
                                />
                                <TextField
                                    name="email"
                                    margin="dense"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    onChange={(event) => this.handleEmailChange(event)}
                                />
                                <TextField
                                    name="password"
                                    margin="dense"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    error={this.state.passwordError}
                                    onChange={(event) => this.handlePasswordChange(event)}
                                />
                                <TextField
                                    name="confirmPassword"
                                    margin="dense"
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                    error={this.state.passwordError}
                                    onChange={(event) => this.handleConfirmPasswordChange(event)}
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
                    {isAuthenticated ? <Profile/> : ""}      
                </div>
                {this.state.isProfile ? "" : [<Map />,
                <Timeline />,
                <TopNResults />]}
                
            </div>
	);
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => {
    return {
        profile: state.firebase.profile,
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

