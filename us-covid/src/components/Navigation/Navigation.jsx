import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Typography, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, SvgIcon, Collapse } from "../Controls";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import MapIcon from '@material-ui/icons/Map';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PublicIcon from '@material-ui/icons/Public';
import CompareIcon from '@material-ui/icons/Compare';
import styles from './Navigation.module.scss'


const propTypes = {
    // Props coming from React Router
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,

    //from Redux
    requests: PropTypes.array,

    //others
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    handleNavigate: PropTypes.func
}

class Navigation extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isInfoExpanded: false,
            isGraphViewExpanded: true
        }

        this.handleGraphViewClick = this.handleGraphViewClick.bind(this);
        
    }

    handleGraphViewClick() {
        this.setState({
            isGraphViewExpanded: !this.state.isGraphViewExpanded
        })
    }

    render() {
        return (
            <Drawer anchor={'left'} open={this.props.isOpen} onClose={this.props.handleClose}>
                <Typography className={styles.title} variant="h4">COVID-19 Tracker</Typography>
                <Divider />
                <List
                    component="nav"
                    className={styles.list}
                >
                    <ListItem button onClick={() => this.props.handleNavigate("/Map")}>
                        <ListItemIcon>
                            <MapIcon />
                        </ListItemIcon>
                        <ListItemText primary="Map View" />
                    </ListItem>
                    <ListItem button onClick={this.handleGraphViewClick}>
                        <ListItemIcon>
                            <ShowChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Graph View" />
                        {this.state.isGraphViewExpanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.isGraphViewExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button style={{ paddingLeft: "36px" }} onClick={() => this.props.handleNavigate("/Global")}>
                                <ListItemIcon>
                                    <PublicIcon />
                                </ListItemIcon>
                                <ListItemText primary="World" secondary="All Countries" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }} onClick={() => this.props.handleNavigate("/US")}>
                                <ListItemIcon>
                                    <SvgIcon viewBox={"128 0 512 512"} className={styles.flagIcon}>
                                        <g fillRule="evenodd">
                                            <g strokeWidth="1pt">
                                                <path fill="#bd3d44" d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z" transform="scale(3.9385)" />
                                                <path fill="#fff" d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z" transform="scale(3.9385)" />
                                            </g>
                                            <path fill="#192f5d" d="M0 0h98.8v70H0z" transform="scale(3.9385)" />
                                            <path fill="#fff" d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z" transform="scale(3.9385)" />
                                        </g>
                                    </SvgIcon>
                                </ListItemIcon>
                                <ListItemText primary="United States" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }} onClick={() => this.props.handleNavigate("/Global/Australia")}>
                                <ListItemIcon>
                                    <SvgIcon viewBox={"0 0 512 512"} className={styles.flagIcon}>
                                        <path id="path598" fill="#006" strokeWidth="1.3" d="M0 0h512v512H0z"/>
                                        <path id="path606" fill="#fff" fillRule="evenodd" strokeWidth="1.3" d="M54.9 368.6L95.5 384l13.4-41.4 13.3 41.4 40.7-15.4-24.1 36.3 37.4 22.2-43.3 3.7 6 43.1-30-31.5-30 31.5 6-43-43.4-3.8L79 404.9m325 71.5l-19 1.6 2.7 18.8-13-13.7-13 13.7L364 478l-18.8-1.6 16.3-9.6L351 451l17.7 6.7 5.8-18 5.7 18L398 451l-10.4 15.8m16.2-270.4L385 198l2.6 18.8-13-13.7-13 13.7L364 198l-18.8-1.6 16.3-9.6L351 171l17.7 6.7 5.8-18 5.7 18L398 171l-10.4 15.8m-88.8 123.4l-18.8 1.6 2.6 18.7-13-13.7-13 13.7 2.5-18.7-18.8-1.6 16.3-9.7-10.5-15.7 17.7 6.7 5.8-18 5.7 18 17.7-6.7-10.4 15.7M497 282.2l-18.8 1.6 2.6 18.7-13-13.7-13 13.7 2.5-18.7-18.8-1.6 16.3-9.7-10.5-15.7 17.7 6.7 5.8-18 5.8 18 17.6-6.7-10.4 15.7M416.6 355l-10.3 6.4 2.9-11.8-9.3-7.8 12-.9 4.7-11.2L421 341l12.1 1-9.2 7.7 2.9 11.8"/>
                                        <g id="g1582" transform="scale(.5)">
                                            <path id="path1560" fill="#006" d="M0 0h512v512H0z"/>
                                            <path id="path1562" fill="#fff" d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"/>
                                            <path id="path1564" fill="#c8102e" d="M184 324l11 34L42 512H0v-3zm124-12l54 8 150 147v45zM512 0L320 196l-4-44L466 0zM0 1l193 189-59-8L0 49z"/>
                                            <path id="path1566" fill="#fff" d="M176 0v512h160V0zM0 176v160h512V176z"/>
                                            <path id="path1568" fill="#c8102e" d="M0 208v96h512v-96zM208 0v512h96V0z"/>
                                        </g>
                                    </SvgIcon>
                                </ListItemIcon>
                                <ListItemText primary="Australia" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }} onClick={() => this.props.handleNavigate("/Global/Canada")}>
                                <ListItemIcon>
                                    <SvgIcon viewBox={"0 0 512 512"} className={styles.flagIcon}>
                                        <path fill="#fff" d="M81.3 3h362.3v512H81.3z" transform="translate(-.2 -3)"/>
                                        <path fill="#d52b1e" d="M-99.8 3H81.3v512H-99.8zm543.4 0h181.1v512H443.6zM135.5 250.4l-14 4.8 65.4 57.5c5 14.8-1.7 19.1-6 26.9l71-9-1.8 71.5 14.8-.5-3.3-70.9 71.2 8.4c-4.4-9.3-8.3-14.2-4.3-29l65.4-54.5-11.4-4.1c-9.4-7.3 4-34.8 6-52.2 0 0-38.1 13.1-40.6 6.2L338 187l-34.6 38c-3.8 1-5.4-.6-6.3-3.8l16-79.7-25.4 14.3c-2.1.9-4.2 0-5.6-2.4l-24.5-49-25.2 50.9c-1.9 1.8-3.8 2-5.4.8l-24.2-13.6 14.5 79.2c-1.1 3-3.9 4-7.1 2.3l-33.3-37.8c-4.3 7-7.3 18.4-13 21-5.7 2.3-25-4.9-37.9-7.7 4.4 15.9 18.2 42.3 9.5 51z" transform="translate(-.2 -3)"/>
                                    </SvgIcon>
                                </ListItemIcon>
                                <ListItemText primary="Canada" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }} onClick={() => this.props.handleNavigate("/Global/China")}>
                                <ListItemIcon>
                                    <SvgIcon viewBox={"0 0 512 512"} className={styles.flagIcon}>
                                        <defs>
                                            <path id="a" fill="#ffde00" d="M1-.3L-.7.8 0-1 .6.8-1-.3z"/>
                                        </defs>
                                        <path fill="#de2910" d="M0 0h512v512H0z"/>
                                        <use width="30" height="20" transform="matrix(76.8 0 0 76.8 128 128)" xlinkHref="#a"/>
                                        <use width="30" height="20" transform="rotate(-121 142.6 -47) scale(25.5827)" xlinkHref="#a"/>
                                        <use width="30" height="20" transform="rotate(-98.1 198 -82) scale(25.6)" xlinkHref="#a"/>
                                        <use width="30" height="20" transform="rotate(-74 272.4 -114) scale(25.6137)" xlinkHref="#a"/>
                                        <use width="30" height="20" transform="matrix(16 -19.968 19.968 16 256 230.4)" xlinkHref="#a"/>
                                    </SvgIcon>
                                </ListItemIcon>
                                <ListItemText primary="China" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }} onClick={() => this.props.handleNavigate("/Global/Denmark")}>
                                <ListItemIcon>
                                    <SvgIcon viewBox={"0 0 512 512"} className={styles.flagIcon}>
                                        <path fill="#c8102e" d="M0 0h512.1v512H0z"/>
                                        <path fill="#fff" d="M144 0h73.1v512H144z"/>
                                        <path fill="#fff" d="M0 219.4h512.1v73.2H0z"/>
                                    </SvgIcon>
                                </ListItemIcon>
                                <ListItemText primary="Denmark" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }} onClick={() => this.props.handleNavigate("/Global/France")}>
                                <ListItemIcon>
                                    <SvgIcon viewBox={"0 0 512 512"} className={styles.flagIcon}>
                                        <g fillRule="evenodd" strokeWidth="1pt">
                                            <path fill="#fff" d="M0 0h512v512H0z"/>
                                            <path fill="#00267f" d="M0 0h170.7v512H0z"/>
                                            <path fill="#f31830" d="M341.3 0H512v512H341.3z"/>
                                        </g>
                                    </SvgIcon>
                                </ListItemIcon>
                                <ListItemText primary="France" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }} onClick={() => this.props.handleNavigate("/Global/Netherlands")}>
                                <ListItemIcon>
                                    <SvgIcon viewBox={"0 0 512 512"} className={styles.flagIcon}>
                                        <path fill="#21468b" d="M0 0h512v512H0z"/>
                                        <path fill="#fff" d="M0 0h512v341.3H0z"/>
                                        <path fill="#ae1c28" d="M0 0h512v170.7H0z"/>
                                    </SvgIcon>
                                </ListItemIcon>
                                <ListItemText primary="Netherlands" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: "36px" }} onClick={() => this.props.handleNavigate("/Global/UnitedKingdom")}>
                                <ListItemIcon>
                                    <SvgIcon viewBox={"0 0 512 512"} className={styles.flagIcon}>
                                        <path fill="#012169" d="M0 0h512v512H0z"/>
                                        <path fill="#FFF" d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"/>
                                        <path fill="#C8102E" d="M184 324l11 34L42 512H0v-3l184-185zm124-12l54 8 150 147v45L308 312zM512 0L320 196l-4-44L466 0h46zM0 1l193 189-59-8L0 49V1z"/>
                                        <path fill="#FFF" d="M176 0v512h160V0H176zM0 176v160h512V176H0z"/>
                                        <path fill="#C8102E" d="M0 208v96h512v-96H0zM208 0v512h96V0h-96z"/>
                                    </SvgIcon>
                                </ListItemIcon>
                                <ListItemText primary="United Kingdom" />
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem button onClick={() => this.props.handleNavigate("/Compare")}>
                        <ListItemIcon>
                            <CompareIcon />
                        </ListItemIcon>
                        <ListItemText primary="Graph Comparison Tool" />
                    </ListItem>
                </List>
            </Drawer>
        )
    }
}

Navigation.propTypes = propTypes;
export default Navigation;