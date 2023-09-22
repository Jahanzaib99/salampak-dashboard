import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

import Table from "./Table";

const useStyles = makeStyles({
    root: {
        margin: 10,
        textAlign: "left"
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    deal: {
        padding: 10
    }
});

export default function OutlinedCard(props) {
    const classes = useStyles();
    const pushToCreateDeal = (data) => {
        props.getPersonDetails(data);
    }
    const pushToCreateContact = () => {
        props.newContact();
    }
    const pushToEditContact = (id) => {
        props.editContact(id);
    }
    const pushToMarkDone = (id, link) => {
        props.markDone(id, link);
    }
    const pushToNewActivity = (data, link) => {
        props.addActivity(data, link);
    }
    const pushToNewPlannedActivity = (data) => {
        props.addPlannedActivity(data);
    }
    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Grid container spacing={4}>
                    <Grid item md={3}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {props.data.label}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {props.data.name}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            {props.data.gender}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {props.data.phone[0].value}
                            <br />
                            {props.data.email[0].value}
                            <br />
                            <br />
                            <br />
                            DoB: {props.data.dob}
                            <br />
                            City: {props.data.city}
                            <br />
                            Country: {props.data.country}
                        </Typography>
                        <div style={{ textAlign: "right" }}>
                            <Button
                                color="primary"
                                size="small"
                                onClick={() => pushToEditContact(props.data.phone[0].value)}>
                                Edit Contact
                            </Button>
                        </div>

                        <Divider variant="middle" style={{ marginTop: 60, marginBottom: 60 }} />

                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Owner
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {props.data.owner_id.name}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {props.data.owner_id.email}
                        </Typography>
                    </Grid>
                    <Grid item md={9}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            Deals
                        </Typography>
                        {/* <Divider variant="middle" /> */}
                        <div className={classes.deal}>
                            <Table
                                deals={props.data.deals}
                                markDone={pushToMarkDone}
                                addActivity={pushToNewActivity}
                                addPlannedActivity={pushToNewPlannedActivity}
                            />
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions style={{ textAlign: "right", padding: 20 }}>
                <Button
                    color="primary"
                    size="small"
                    onClick={() => pushToCreateDeal({ id: props.data.id, name: props.data.name })}>
                    Create New Deal
                    </Button>
                <Button
                    color="primary"
                    size="small"
                    onClick={() => pushToCreateContact()}>
                    Create New Contact
                </Button>
            </CardActions>
        </Card>
    );
}