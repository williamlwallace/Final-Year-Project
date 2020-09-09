import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Button, Text, Paper, Grid, Avatar} from '@material-ui/core';
import theme from '../themes/cokiTheme';



const styles = theme => ({
    root: {
        margin: 100,
        padding: '2px 8px 0px 8px',
        justifyContents: 'center',
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
    
    render() {
        const { classes, profile, auth } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Avatar className={classes.avatar}>{profile.initials}</Avatar>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>Email: {auth.email}</Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>First Name: {profile.firstName}</Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>Last Name: {profile.lastName}</Paper>
                    </Grid>
                </Grid>
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
