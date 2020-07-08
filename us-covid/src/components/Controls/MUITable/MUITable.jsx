import React, { Component } from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const propTypes = {
    //from Redux
    hotSpots: PropTypes.object
}

class MUITable extends Component {
    constructor(props) {
        super(props);

        //this.handleCloseInfoIcon = this.handleCloseInfoIcon.bind(this);
    }

    render() {
        return (
            <div>Hi</div>
        )
    }
}

propTypes.MUITable = propTypes;
export default MUITable;