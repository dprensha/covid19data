import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography, Toolbar, AppBar, IconButton, Divider, KPI, Radio, RadioGroup, FormControlLabel, FormControl, TextField, InputAdornment, Drawer, ButtonGroup, Button } from "../Controls";

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import MapIcon from '@material-ui/icons/Map';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PublicIcon from '@material-ui/icons/Public';

const propTypes = {
    // Props coming from React Router
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,

    //from Redux
    requests: PropTypes.array,

    //others
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func
}

class Navigation extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isInfoExpanded: false,

            open: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            open: !this.state.open
        })
    }

    render() {
        return (
            <Drawer anchor={'left'} open={this.props.isOpen} onClose={this.props.handleClose}>
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Nested List Items
                        </ListSubheader>
                    }
                    style={{ width: "300px" }}
                >
                    <ListItem button>
                        <ListItemIcon>
                            <MapIcon />
                        </ListItemIcon>
                        <ListItemText primary="Map View" />
                    </ListItem>
                    <ListItem button onClick={this.handleClick}>
                        <ListItemIcon>
                            <ShowChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Graph View" />
                        {this.state.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button style={{ paddingLeft: "36px" }}>
                                <ListItemIcon>
                                    <PublicIcon />
                                </ListItemIcon>
                                <ListItemText primary="World" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }}>
                                <ListItemIcon>
                                    <PublicIcon />
                                </ListItemIcon>
                                <ListItemText primary="United States" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }}>
                                <ListItemIcon>
                                    <PublicIcon />
                                </ListItemIcon>
                                <ListItemText primary="Australia" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }}>
                                <ListItemIcon>
                                    <PublicIcon />
                                </ListItemIcon>
                                <ListItemText primary="China" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }}>
                                <ListItemIcon>
                                    <PublicIcon />
                                </ListItemIcon>
                                <ListItemText primary="Denmark" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }}>
                                <ListItemIcon>
                                    <PublicIcon />
                                </ListItemIcon>
                                <ListItemText primary="France" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }}>
                                <ListItemIcon>
                                    <PublicIcon />
                                </ListItemIcon>
                                <ListItemText primary="Netherlands" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }}>
                                <ListItemIcon>
                                    <PublicIcon />
                                </ListItemIcon>
                                <ListItemText primary="United Kingdom" />
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </Drawer>
        )
    }
}

Navigation.propTypes = propTypes;
export default Navigation;