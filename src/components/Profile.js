import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Button, Text, Paper, Grid, Avatar} from '@material-ui/core';
import theme from '../themes/cokiTheme';
import TextField from '@material-ui/core/TextField'
import { updateUser } from '../store/actions/authActions';



const styles = theme => ({
    root: {
        margin: 100,
        justifyContent: 'center',
    },
    paper: {
        maxWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
    avatar: {
        maxWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        backgroundColor: theme.palette.secondary[500]
    },
});

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            firstName: props.profile.firstName,
            lastName: props.profile.lastName,
        };
    }

    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
      }

    toggleEdit = () => {
        this.setState({
            isEdit: !this.state.isEdit
        });
    }

    updateProfile = () => {
        const { dispatch } = this.props;
        const { firstName, lastName} = this.state;
        dispatch(updateUser(firstName, lastName))
        this.toggleEdit()
    }

    
    render() {
        const { classes, profile, auth } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Avatar className={classes.avatar}>{profile.initials}</Avatar>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Email</Typography>
                        <Paper className={classes.paper}>{auth.email}</Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {this.state.isEdit ? 
                            <TextField id="firstName" defaultValue={profile.firstName} onChange={this.handleChange}></TextField> : 
                            <Typography>First Name: {profile.firstName}</Typography>}
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {this.state.isEdit ? 
                            <TextField id="lastName" defaultValue={profile.lastName} onChange={this.handleChange}></TextField> :
                            <Typography>Last Name: {profile.lastName}</Typography>}
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        {this.state.isEdit ? 
                        [<Button onClick={this.toggleEdit}>Cancel</Button>,<Button onClick={this.updateProfile}>Save Changes</Button>] :
                        <Button onClick={this.toggleEdit}>Edit</Button>}
                    </Grid>
                </Grid>
                {/* <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Avatar className={classes.avatar}>{profile.initials}</Avatar>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Email: {auth.email}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {this.state.isEdit ? 
                        <TextField id="firstName" defaultValue={profile.firstName} onChange={this.handleChange}></TextField> : 
                        <Typography>First Name: {profile.firstName}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                        {this.state.isEdit ? 
                        <TextField id="lastName" defaultValue={profile.lastName} onChange={this.handleChange}></TextField> :
                        <Typography>Last Name: {profile.lastName}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                        {this.state.isEdit ? 
                        [<Button onClick={this.toggleEdit}>Cancel</Button>,<Button onClick={this.updateProfile}>Save Changes</Button>] :
                        <Button onClick={this.toggleEdit}>Edit</Button>}
                    </Grid>
                </Grid>
                </Paper> */}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        profile: state.firebase.profile,
        auth: state.firebase.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
        dispatch
    });
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(withStyles(styles)(Profile));
