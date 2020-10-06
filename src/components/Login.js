import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { GoogleLogin } from 'react-google-login'

import { loginUser, logoutUser, createUser } from "../store/actions/authActions";

const styles = theme => ({
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: 10,
        marginRight: 10
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

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRegister: false,
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            passwordError: false,
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

    toggleRegister = () => {
        this.setState({
            isRegister: !this.state.isRegister,
            passwordError: false
        });
    }

    render() {

        const {classes, isRegister, isOpen, toggleDialog} = this.props;

        return(
        <Dialog open={isOpen} onClose={toggleDialog} aria-labelledby="form-dialog-title">
        {isRegister ?
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
                    id="emaillogin"
                    label="Email"
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
        )
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
)(withStyles(styles)(Login));
